const express=require('express')
const router=express.Router()


router.get('/',async (req,res)=> {
    //if ((data.tipoProducto).includes(block) ){
        

    //}

  const marcas = await pool.query('SELECT * FROM companies where ambm = 1')
  const proveedores = await pool.query('SELECT * FROM companies where ambp = 1')
  const tipoblock = await pool.query('SELECT * FROM producttype where tipo=0')
  const tipouser= await pool.query('SELECT * FROM producttype where tipo=1')
  const ivablock=await pool.query('SELECT * FROM ivatype where tipo=0')
  const ivauser=await pool.query('SELECT * FROM ivatype where tipo=1')
  const allivas=await pool.query('SELECT * FROM ivatype' )
  const products=await pool.query('SELECT * FROM product')

  console.log(proveedores)
  products.forEach(p => {
    for(let v in allivas){
        if(allivas[v].id == p.tipoIVA){
            //console.log(allivas[v].valor+"%")
            p.tipoIVA=allivas[v].valor+"%"
        }
    }
    for(let v in proveedores){
        console.log(v)
        if(proveedores[v].id == p.proveedor){
            p.proveedor=proveedores[v].company
        }
    }

    
  });
  res.render('productos',{products, marcas, proveedores, tipoblock, tipouser, ivablock, ivauser})

})
/* AÑADIR PRODUCTO */
router.post('/stock/addProduct',async (req, res) => {
    const data=req.body
    console.log(data)
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

    await pool.query('INSERT INTO product SET ?',[data] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar producto')
            res.send('Error al insertar producto')
        }else{
            let url='/productos'
            res.redirect(url)
        }
    })


    
    

})

/* AÑADIR TIPO DE PRODUCTO */
/*router.post('/stock/addProductType',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let com={
        valor: req.body.tipoProducto
    }
    await pool.query('INSERT INTO producttypeuser SET ?',[com] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo de producto')
            res.send('Error al insertar tipo de producto')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    //res.send('Voy a enviar el tipo de producto')
})*/

const pool=require('../database')
module.exports =  router