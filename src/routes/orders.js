const express=require('express')
const router=express.Router()


router.get('/',async (req,res)=> {
    const pacientes = await pool.query('SELECT * FROM patient WHERE idcompany=?',[req.user.company])
    const pedidos = await pool.query('SELECT orders.*, companies.company, orderstates.nombre as nombreestado FROM orders, orderstates, companies WHERE orders.idcomp=companies.id and orders.idcompany=? and orders.estado=orderstates.id and companies.idcompany=? ORDER BY orders.fechaModificacion DESC',[req.user.company,req.user.company])
    const companies = await pool.query('SELECT * FROM companies where ambp=1 and idcompany=?',[req.user.company])
    let orders=[]
    pedidos.forEach(p =>{
        let pedido={
            id:p.id,
            para:'',
            estado:p.estado,
            referencia:p.referencia,
            company: p.company,
            nombreestado: p.nombreestado,
            fechaCreacion: p.fechaCreacion ,
            fechaModificacion: p.fechaModificacion
        }
        if(p.tipo==0){
            pedido.para="Empresa"
        }else{
            
            pacientes.forEach(pac =>{
                if(p.idpac == pac.id){
                    pedido.para = pac.nombre+" "+pac.primerApellido+" "+pac.segundoApellido
                }
            })
            
        }
        orders.push(pedido)

    })
    res.render('pedidos',{pacientes, pedidos, orders, companies, tipop:1})
});

router.post('/add',async (req, res) => {
    
    const order = req.body
    console.log (order)
    let pedido={}
    if(order.radio1 == "empresa"){
        pedido.tipo=0
    }else if(order.radio1 == "paciente"){
        pedido.tipo=1
        pedido.idpac=parseInt(order.paciente,10)
    }
    pedido.referencia=order.refOrder
    pedido.idcomp=order.company
    pedido.idcompany=req.user.company

    console.log(pedido)
    await pool.query('INSERT INTO orders SET ?',[pedido],async function(err, result, fields) {
        if (err) {
          console.log('Error al insertar pedido')
          res.send('Error al insertar pedido')
        }else{
            idorder=result.insertId
            let url='/pedidos/pedido/'+idorder
            res.redirect(url)
        }
    })
})


/* GET PEDIDO */
router.get('/pedido/:id', async (req,res)=>{
    //console.log('Pedido:',req.params.id)
    const estados= await pool.query('SELECT * FROM orderStates')
    const tipo =  await pool.query('SELECT tipo, idcomp FROM orders where id=? and idcompany=? LIMIT 1',[req.params.id, req.user.company])
    let pedido=''
    let order={}
    if(tipo[0].tipo == 1 ){
        pedido = await pool.query('SELECT orders.id, orders.idcompany, orders.referencia, orders.estado, patient.nombre, patient.primerApellido, patient.segundoApellido, companies.company FROM orders , patient, companies  where orders.id = ? and orders.idcompany=? and patient.idcompany=? and companies.idcompany=? and orders.idpac=patient.id and orders.idcomp=companies.id LIMIT 1',[req.params.id, req.user.company, req.user.company, req.user.company])
        order={
            id:pedido[0].id,
            paciente: pedido[0].nombre+" "+pedido[0].primerApellido+" "+pedido[0].segundoApellido,
            referencia: pedido[0].referencia,
            company: pedido[0].company,
            estado: pedido[0].estado,
            idcompany: pedido[0].idcompany
    
        }
    }else{
        pedido = await pool.query('SELECT orders.id, orders.idcompany, orders.referencia, orders.estado, companies.company FROM orders , patient, companies  where orders.id = ? and orders.idcompany=? and patient.idcompany=? and companies.idcompany=? and orders.idcomp=companies.id LIMIT 1',[req.params.id, req.user.company,req.user.company, req.user.company])
        order={
            id:pedido[0].id,
            paciente: "Empresa",
            referencia: pedido[0].referencia,
            company: pedido[0].company,
            estado:pedido[0].estado,
            idcompany: pedido[0].idcompany
    
        }
    }
    
    const products=await pool.query('SELECT * FROM product where proveedor = ? and idcompany=?',[tipo[0].idcomp, req.user.company])

    if(order.idcompany == req.user.company){
        const productosPedido=await pool.query('SELECT dataorder.*, product.nombre FROM dataorder, product where dataorder.idProd=product.id and dataorder.idOrder = ?',[req.params.id])
        res.render('pedidos/pedido',{ order, productosPedido, products, estados, tipoProducto:'order' })
    }else{
        req.flash('error','Error al leer el pedido')
        res.redirect('/pedidos')
    }
  
})



/* BORRAR PEDIDO */
router.get('/pedido/delete/:id',async (req, res) => {
    await pool.query('DELETE FROM orders WHERE id= ? and idcompany=?',[req.params.id, req.user.company])
    req.flash('success','Pedido eliminado correctamente')
    res.redirect('/pedidos')
})

/* AÑADIR PRODUCTO A PEDIDO */
router.post('/pedido/addProduct/:idorder',async (req, res) => {
    console.log(req.body)

    let company=await pool.query(' SELECT idcomp FROM orders WHERE id=? and idcompany=? LIMIT 1',[req.params.idorder, req.user.company])
    let companyProd=await pool.query(' SELECT proveedor FROM product WHERE id=? and idcompany=? LIMIT 1',[req.body.productoSeleccionado, req.user.company])
    
    //console.log(company[0].idcomp == companyProd[0].proveedor)
    if(company[0].idcomp == companyProd[0].proveedor){
        let pr={
            idOrder: parseInt(req.params.idorder),
            idProd: parseInt(req.body.productoSeleccionado),
            cantidad: parseInt(req.body.cantidad),
            comentario: req.body.comentarioPedido
        }
        console.log(pr)
        await pool.query('INSERT INTO dataorder SET ?',[pr],async function(err, result, fields) {
            if (err) {
              console.log('Error al insertar datos de pedido')
              res.send('Error al insertar datos de pedido')
            }else{
                await pool.query('UPDATE orders SET fechaModificacion = CURRENT_TIMESTAMP where id=?',[req.params.idorder])
                req.flash('success','Producto de pedido añadido correctamente')
                let url='/pedidos/pedido/'+req.params.idorder
                res.redirect(url)
            }
        })
    }
    res.send('Error no coincide el producto con el proveedor')
    
})

/* EDITAR PRODUCTO DE PEDIDO*/
router.post('/pedido/editProduct/:id/:idorder',async (req, res) => {
    

    await pool.query('UPDATE orders SET fechaModificacion = CURRENT_TIMESTAMP where id=? and idcompany=?',[req.params.idorder, req.user.company])
    await pool.query('UPDATE dataorder SET idProd = ?, cantidad= ?, comentario=? WHERE id= ? and idOrder =?',[req.body.productoSeleccionado, req.body.cantidad, req.body.comentarioPedido, req.params.id, req.params.idorder])
    
    req.flash('success','Producto de pedido editado correctamente')
    let url='/pedidos/pedido/'+req.params.idorder
    res.redirect(url)
})

/* BORRAR PRODUCTO DE PEDIDO */
router.get('/pedido/deleteProductOrder/:id/:idorder',async (req, res) => {
    await pool.query('DELETE FROM dataorder WHERE id= ? and idOrder=?',[req.params.id, req.params.idorder])
    await pool.query('UPDATE orders SET fechaModificacion = CURRENT_TIMESTAMP where id=? and idcompany=?',[req.params.idorder, req.user.company])
    req.flash('success','Producto de pedido eliminado correctamente')
    let url='/pedidos/pedido/'+req.params.idorder
    res.redirect(url)
})



const pool=require('../database')
module.exports =  router