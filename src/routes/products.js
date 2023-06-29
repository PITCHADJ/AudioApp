const express=require('express')
const router=express.Router()


router.get('/',async (req,res)=> {
    //if ((data.tipoProducto).includes(block) ){
        

    //}

  const marcas = await pool.query('SELECT * FROM companies where ambm = 1 and idcompany=?',[req.user.company])
  const proveedores = await pool.query('SELECT * FROM companies where ambp = 1 and idcompany=?',[req.user.company])
  const tipoblock = await pool.query('SELECT * FROM producttype where tipo=0')
  const tipouser= await pool.query('SELECT * FROM producttype where tipo=1 and idcompany=?',[req.user.company])
  const ivablock=await pool.query('SELECT * FROM ivatype where tipo=0')
  const ivauser=await pool.query('SELECT * FROM ivatype where tipo=1 and idcompany=?',[req.user.company])
  const allivas=await pool.query('SELECT * FROM ivatype WHERE idcompany is NULL or  idcompany=?',[req.user.company] )
  const products=await pool.query('SELECT * FROM product WHERE  idcompany=?',[req.user.company])

  //console.log(proveedores)
  //console.log(products)
  products.forEach(p => {
    for(let v in allivas){
        if(allivas[v].id == p.tipoIVA){
            //console.log(allivas[v].valor+"%")
            p.tipoIVATex=allivas[v].valor+"%"
        }
    }
    for(let v in proveedores){
        //console.log(v)
        if(proveedores[v].id == p.proveedor){
            p.proveedorTex=proveedores[v].company
        }
    }

    
  });
  //console.log(products)
  res.render('productos',{products, marcas, proveedores, tipoblock, tipouser, ivablock, ivauser})

})
/* AÑADIR PRODUCTO */
router.post('/stock/addProduct',async (req, res) => {
    const data=req.body
    //console.log(data)
    if (data.proveedor === undefined ){
        data['proveedor']=0
    } else {
        data['proveedor']=parseInt(data['proveedor'],10)
        //Comprobar proveedor Válido

    }
    if(data.marca != 0){
        //comprobar marca válida

    }

    if (data.reparable === undefined) {
        data['reparable'] = 0
    }else{
        data['reparable'] = 1
    }

    if (data.ns === undefined) {
        data['ns'] = 0
    }else{
        data['ns'] = 1
    }

    if (data.recurrente === undefined) {
        data['recurrente'] = 0
    }else{
        data['recurrente'] = 1
    }
    data['precioCompra']=parseFloat(data['precioCompra'])
    data['precioVenta']=parseFloat(data['precioVenta'])
    data['tipo']=parseInt(data['tipo'],10)
    data['tipoIVA']=parseInt(data['tipoIVA'],10)
    //console.log(data['cantidad'], Number.isNaN( parseInt(data['cantidad'],10)))
    data['cantidad']=parseInt(data['cantidad'], 10)
    data['cantidadminima']=parseInt(data['cantidadminima'], 10)
    data['marca']=parseInt(data['marca'], 10)
    if(Number.isNaN( data['cantidad'])){
        data['cantidad']=0
    }
    if(Number.isNaN( data['cantidadminima'])){
        data['cantidadminima']=0
    }
    data.idcompany=req.user.company
    
    //console.log(data)

    await pool.query('INSERT INTO product SET ?',[data] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar producto')
            res.send('Error al insertar producto')
        }else{
            req.flash('success','Producto añadido correctamente')
            let url='/productos'
            res.redirect(url)
        }
    })


    
    

})

/* EDITAR PRODUCTO */
router.post('/stock/editProduct/:id',async (req, res) => {
    const id=req.params.id
    const data=req.body
    //console.log(data)
    if (data.proveedor === undefined ){
        data['proveedor']=0
    } else {
        data['proveedor']=parseInt(data['proveedor'],10)
        //Comprobar proveedor Válido

    }
    if(data.marca != 0){
        //comprobar marca válida

    }

    if (data.reparable === undefined) {
        data['reparable'] = 0
    }else{
        data['reparable'] = 1
    }

    if (data.ns === undefined) {
        data['ns'] = 0
    }else{
        data['ns'] = 1
    }

    if (data.recurrente === undefined) {
        data['recurrente'] = 0
    }else{
        data['recurrente'] = 1
    }
    data['precioCompra']=parseFloat(data['precioCompra'])
    data['precioVenta']=parseFloat(data['precioVenta'])
    data['tipo']=parseInt(data['tipo'],10)
    data['tipoIVA']=parseInt(data['tipoIVA'],10)
    //console.log(data['cantidad'], Number.isNaN( parseInt(data['cantidad'],10)))
    data['cantidad']=parseInt(data['cantidad'], 10)
    data['cantidadminima']=parseInt(data['cantidadminima'], 10)
    data['marca']=parseInt(data['marca'], 10)
    if(Number.isNaN( data['cantidad'])){
        data['cantidad']=0
    }
    if(Number.isNaN( data['cantidadminima'])){
        data['cantidadminima']=0
    }
    
    console.log(data)

    await pool.query('UPDATE product SET ? WHERE id = ? and idcompany=?',[data, id, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al editar producto')
            res.send('Error al editar producto')
        }else{
            req.flash('success','Producto editado correctamente')
            let url='/productos'
            res.redirect(url)
        }
    })



})

/* ELIMINAR PRODUCTO */
router.get('/stock/deleteProduct/:id',async (req, res) => {
    const id=req.params.id
    await pool.query('DELETE FROM product WHERE id = ? and idcompany=?',[id, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al eliminar producto')
            res.send('Error al eliminar producto')
        }else{
            req.flash('success','Producto eliminado correctamente')
            let url='/productos'
            res.redirect(url)
        }
    })
    
})


const pool=require('../database')
module.exports =  router