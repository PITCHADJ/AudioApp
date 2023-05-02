const express=require('express')
const router=express.Router()

router.get('/',async (req,res)=>{
    res.render('administracion')
    
})


router.get('/stock', async (req,res)=>{

    const types = await pool.query('SELECT * FROM producttype where tipo=0')
    const usertypes = await pool.query('SELECT * FROM producttype where tipo=1' )
    const companies = await pool.query ('SELECT * FROM companies')
    const ivablock=await pool.query('SELECT * FROM ivatype where tipo=0')
    const ivauser=await pool.query('SELECT * FROM ivatype where tipo=1')
    //console.log(types)
    res.render('administracion/stock', {types, usertypes, companies, ivablock, ivauser})
    //res.redirect('/pacientes')
})

router.get('/paciente', async (req,res)=>{

    //console.log(types)
    res.render('administracion/paciente')
    //res.redirect('/pacientes')
})

/* AÑADIR TIPO DE PRODUCTO */
router.post('/stock/addProductType',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let com={
        tipo:1,
        valor: req.body.tipoProducto
    }

    await pool.query('INSERT INTO producttype SET ?',[com] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo de producto')
            res.send('Error al insertar tipo de producto')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    //res.send('Voy a enviar el tipo de producto')
})
/* EDITAR TIPO DE PRODUCTO */
router.post('/stock/editProductType/:id',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let com=req.params.id
    await pool.query('UPDATE producttype SET valor = ? WHERE id = ? and tipo=1',[req.body.tipoProducto, com],function(err, result, fields) {
        if (err) {
            console.log('Error al editar tipo de producto')
            res.send('Error al editar tipo de producto')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR TIPO DE PRODUCTO */
router.get('/stock/deleteProductType/:id',async (req, res) => {
    
    const tp=req.params.id
    await pool.query('DELETE FROM producttypeuser WHERE id = ?',[tp],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar tipo de producto')
            res.send('Error al borrar tipo de producto')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

   
})

/* AÑADIR TIPO DE IVA */
router.post('/stock/addIVAType',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let data={
        tipo: 1,
        nombre: req.body.nombreIVA,
        valor: req.body.valorIVA
    }
    await pool.query('INSERT INTO ivatype SET ?',[data] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo de IVA')
            res.send('Error al insertar tipo de IVA')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    //res.send('Voy a enviar el tipo de producto')
})
/* EDITAR TIPO DE IVA */
router.post('/stock/editIVAType/:id',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let com=req.params.id
    let data={
        nombre: req.body.nombreIVA,
        valor: req.body.valorIVA
    }
    await pool.query('UPDATE ivatypeuser SET valor = ? WHERE id = ? and tipo=1',[data,com],function(err, result, fields) {
        if (err) {
            console.log('Error al editar tipo de IVA')
            res.send('Error al editar tipo de IVA')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR TIPO DE PRODUCTO */
router.get('/stock/deleteIVAType/:id',async (req, res) => {
    
    const tp=req.params.id
    await pool.query('DELETE FROM ivatypeuser WHERE id = ? and tipo=1',[tp],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar tipo de IVA')
            res.send('Error al borrar tipo de IVA')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

   
})

/* AÑADIR EMPRESA */
router.post('/stock/addCompany',async (req, res) => {
    //console.log(req.body)
    
    let ambp= req.body.ambp
    if (ambp === undefined) {
        ambp = 0
    }else{
        ambp = 1
    }
    let ambm= req.body.ambm
    if (ambm === undefined) {
        ambm = 0
    }else{
        ambm = 1
    }
    let ambr= req.body.ambr
    if (ambr === undefined) {
        ambr = 0
    }else{
        ambr = 1
    }
    let ambf= req.body.ambf
    if (ambf === undefined) {
        ambf = 0
    }else{
        ambf = 1
    }
    
    let company={
        company: req.body.company,
        CIF: req.body.CIF,
        correo: req.body.correo,
        telefono: req.body.telefono,
        Observaciones: req.body.Observaciones,
        ambp: ambp,
        ambm: ambm,
        ambr: ambr,
        ambf: ambf
    }
    
     await pool.query('INSERT INTO companies SET ?',[company], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar empresa')
            res.send('Error al insertar empresa')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })
    
    //res.send('Voy a insertar empresa')
})

/* EDITAR EMPRESA */
router.post('/stock/editCompany/:id',async (req, res) => {
    console.log(  req.body)
    let ambp= req.body.ambp
    if (ambp === undefined) {
        ambp = 0
    }else{
        ambp = 1
    }
    let ambm= req.body.ambm
    if (ambm === undefined) {
        ambm = 0
    }else{
        ambm = 1
    }
    let ambr= req.body.ambr
    if (ambr === undefined) {
        ambr = 0
    }else{
        ambr = 1
    }
    let ambf= req.body.ambf
    if (ambf === undefined) {
        ambf = 0
    }else{
        ambf = 1
    }
    
    let company={
        company: req.body.company,
        CIF: req.body.CIF,
        correo: req.body.correo,
        telefono: req.body.telefono,
        Observaciones: req.body.Observaciones,
        ambp: ambp,
        ambm: ambm,
        ambr: ambr,
        ambf: ambf
    }
    let com=req.params.id
    console.log(company, com)
    await pool.query('UPDATE companies SET ? WHERE id = ?',[company, com],function(err, result, fields) {
        if (err) {
            console.log('Error al editar Empresa')
            res.send('Error al editar Empresa')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR EMPRESA */
router.get('/stock/deleteCompany/:id',async (req, res) => {
    
    
    await pool.query('DELETE FROM companies WHERE id = ?',[req.params.id],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar Empresa')
            res.send('Error al borrar Empresa')
        }else{
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

   
})

const pool=require('../database')
module.exports =  router