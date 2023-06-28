const express=require('express')
const router=express.Router()


router.get('/',async (req,res)=>{
    const pacientes= await pool.query('SELECT * FROM patient where idcompany=?',[req.user.company])
    const estimates = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=1 and estimates.idpac=patient.id and patient.idcompany=? ORDER BY fecha DESC',[req.user.company])
    //console.log(estimates)
    res.render('presupuestos',{estimates, pacientes, tipop:1})
    
})

/*AÑADIR PRESUPUESTO */
router.post('/add',async (req,res)=>{
    const data={    
        idpac: parseInt(req.body.paciente),
        comentario: req.body.comentarioPresupuesto,
        tipo:1
    }
    console.log(data)
    await pool.query('INSERT INTO estimates SET ?',[data],async function(err, result, fields) {
        if (err) {
          console.log('Error al crear presupuesto')
          res.send('Error al crear presupuesto')
        }else{
            idestimate=result.insertId
            let url='/presupuestos/presupuesto/'+idestimate
            res.redirect(url)
        }
    })
    
    
})

router.get('/presupuesto/:id',async (req,res)=>{
    const companypatient=await pool.query('SELECT patient.idcompany FROM estimates, patient WHERE estimates.tipo=1 and estimates.id=? and estimates.idpac=patient.id',[req.params.id])

    if (companypatient[0].idcompany == req.user.company){
        const estados= await pool.query('SELECT * FROM estimatesStates')
        const estimate= await pool.query('SELECT estimates.id, estimates.idpac, estimates.estado, estimates.comentario, estimates.fecha, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=1 and estimates.id=? and estimates.idpac=patient.id and patient.idcompany=? LIMIT 1',[req.params.id, req.user.company])
        const productos= await pool.query('SELECT * FROM product where cantidad>0 and idcompany=?',[req.user.company])
        const productosPresupuesto = await pool.query('SELECT dataestimate.*, product.nombre as productnombre, product.precioventa, product.tipoIVA, ivatype.nombre as ivanombre, ivatype.valor FROM dataestimate, product, ivatype where dataestimate.idpres=? and dataestimate.idprod=product.id and product.tipoIVA=ivatype.id',[req.params.id])
        total=0
        productosPresupuesto.forEach(pro => {
            pro.total = pro.cantidad * pro.precioventa
            console.log("pro", pro)
            let descu=0
            if(pro.iddesc == 1 && pro.descuento>0){
                let i=( pro.descuento / 100 )
                console.log(pro.cantidad, pro.precioventa, i)
                descu=pro.cantidad * pro.precioventa * i
                console.log("descu", descu)
            }else if(pro.iddesc == 2 && pro.descuento>0){
                descu= pro.descuento
                console.log("descu", descu)
            }
            pro.descuentoT=descu
            total+=pro.total-descu
            
        });
        //console.log("Presupuesto",estimate)
        //console.log("Productos",productosPresupuesto) 
        res.render('presupuestos/presupuesto',{estimate: estimate[0], estados, productos, productosPresupuesto,total})
    }else{
        req.flash('error','No tiene permiso para ver el presupuesto')
        let url='/presupuestos'
        res.redirect(url)
    }
    
    

})
/* AÑADIR PRODUCTO A PRESUPUESTO */
router.post('/presupuesto/addproduct/:id',async (req,res)=>{
    let idestimate=req.params.id;
    //console.log(req.body);
    let tipoDesc=req.body.tipoDesc
    let descuento=req.body.descuento
    let producto=await pool.query('SELECT * FROM product WHERE id=? and idcompany=? LIMIT 1',[req.body.productoSeleccionado, req.user.company])
    if(tipoDesc==0){
        descuento=0
    }
    //console.log(producto[0].precioVenta, descuento, tipoDesc)
    //console.log((0 <= producto[0].precioVenta) && (producto[0].precioVenta >= descuento))
    // Si descuento en € comprobamos que no sea mayor que el precio del producto y si es % comprobamos que no sea mayor que 100
    if ((tipoDesc==2 && 0 <= producto[0].precioVenta && producto[0].precioVenta >= descuento) || (tipoDesc==1 && 0 <= descuento && descuento <= 100) || (tipoDesc==0)) {
        let data={
            idpres: idestimate,
            idprod: req.body.productoSeleccionado,
            cantidad: req.body.cantidad,
            iddesc: req.body.tipoDesc,
            descuento: descuento
        }
    
        await pool.query('INSERT INTO dataestimate SET ?',[data],async function(err, result, fields) {
            if (err) {
              console.log('Error al añadir producto al presupuesto')
              res.send('Error al añadir producto al presupuesto')
            }else{
                req.flash('success','Producto añadido correctamente al presupuesto')
                let url='/presupuestos/presupuesto/'+idestimate
                res.redirect(url)
            }
        })
    }else{
        res.send('No se cumplen los criterios para agregar producto al presupuesto')
    }
    
})


/* ELIMINAR PRODUCTO DE PRESUPUESTO */
router.get('/presupuesto/deleteProductEstimate/:id/:idestimate',async (req,res)=>{
    
    let idestimate=req.params.idestimate
    let id=req.params.id
    const companypatient=await pool.query('SELECT patient.idcompany FROM estimates, patient WHERE estimates.tipo=1 and estimates.id=? and estimates.idpac=patient.id',[req.params.idestimate])
    //console.log(companypatient)
    if(companypatient[0].idcompany == req.user.company){
        await pool.query('DELETE FROM dataestimate WHERE id = ?',[id],function(err, result, fields) {
            if (err) {
                console.log('Error al eliminar producto del presupuesto')
                res.flash('error','Error al eliminar producto del presupuesto')
                let url='/presupuestos/presupuesto/'+idestimate
                res.redirect(url)
            }else{
                req.flash('success','Producto eliminado correctamente del presupuesto')
                let url='/presupuestos/presupuesto/'+idestimate
                res.redirect(url)
            }
        })
    }
    
})

/* EDITAR PRODUCTO DE PRESUPUESTO */
router.post('/presupuesto/editProduct/:id/:idpre', async (req,res)=>{
    let idestimate=req.params.idpre;
    
    let tipoDesc=req.body.tipoDesc
    let descuento=req.body.descuento
    let producto=await pool.query('SELECT * FROM product WHERE id=? and idcompany=? LIMIT 1',[req.body.productoSeleccionado, req.user.company])
    if(tipoDesc==0){
        descuento=0
    }
    
    // Si descuento en € comprobamos que no sea mayor que el precio del producto y si es % comprobamos que no sea mayor que 100
    if ((tipoDesc==2 && 0 <= producto[0].precioVenta && producto[0].precioVenta >= descuento) || (tipoDesc==1 && 0 <= descuento && descuento <= 100) || (tipoDesc==0)) {
        let data={
            idprod: req.body.productoSeleccionado,
            cantidad: req.body.cantidad,
            iddesc: req.body.tipoDesc,
            descuento: descuento
        }
        console.log(req.body)
    
        await pool.query('UPDATE dataestimate SET idprod=?, cantidad=?, iddesc=?, descuento=? WHERE id=? and idpres=? ',[req.body.productoSeleccionado, req.body.cantidad, req.body.tipoDesc, descuento, req.params.id, req.params.idpre],async function(err, result, fields) {
            if (err) {
              console.log('Error al editar producto de presupuesto')
              res.send('Error al editar producto de presupuesto')
            }else{
                req.flash('success','Producto de presupuesto editado correctamente')
                let url='/presupuestos/presupuesto/'+idestimate
                res.redirect(url)
            }
        })
    }else{
        res.send('No se cumplen los criterios para agregar producto al presupuesto')
    }

})


/* EDITAR ESTADO DE PRESUPUESTO */
router.post('/presupuesto/updateEstimate/:idpre/:id', async (req,res)=>{
    let presupuesto=req.params.idpre
    let estado=parseInt(req.params.id)
    console.log(estado)
    switch (estado){
        case 2: 
            //Aceptamos presupuesto, convertimos a venta
            await pool.query('UPDATE estimates SET tipo = 2, estado = 1 WHERE id= ?',[presupuesto],function(err, result, fields) {
                if (err) {
                    console.log('Error al actualizarEstado del presupuesto')
                    res.send('Error al actualizarEstado del presupuesto')
                }else{
                    req.flash('success','El presupuesto se ha convertido en venta')
                    let url='/ventas/venta/'+presupuesto
                    res.redirect(url)
                }
            })
            break;
        case 3:
            console.log("Vamos a cancelar") 
            //Cancelamos presupuesto
            await pool.query('UPDATE estimates SET tipo = 1, estado = 3 WHERE id= ?',[presupuesto],function(err, result, fields) {
                if (err) {
                    console.log('Error al actualizarEstado del presupuesto')
                    res.send('Error al actualizarEstado del presupuesto')
                }else{
                    req.flash('success','El presupuesto se ha rechazado')
                    let url='/presupuestos/presupuesto/'+presupuesto
                    res.redirect(url)
                }
            })
            break;
        default:
            console.log('Estamos fallando')
    }

    
})


const pool=require('../database')
module.exports =  router
