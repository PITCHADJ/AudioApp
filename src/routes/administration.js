const express=require('express')
const router=express.Router()
const helpers = require('../lib/helpers')
const multer = require('multer')
var fs = require('fs');
const path=require('path')


const storageCenter = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.user.company)
        var dir = 'src/public/img/centers/'+req.user.company;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, "centro-"+file.originalname)
    }
  })
  
  const uploadCenter = multer({ storage: storageCenter })

router.get('/',async (req,res)=>{
    res.render('administracion')
    
})


router.get('/stock', async (req,res)=>{

    const types = await pool.query('SELECT * FROM producttype where tipo=0')
    const usertypes = await pool.query('SELECT * FROM producttype where tipo=1 and idcompany=?',[req.user.company] )
    const companies = await pool.query ('SELECT * FROM companies WHERE idcompany=?',[req.user.company])
    const ivablock=await pool.query('SELECT * FROM ivatype where tipo=0')
    const ivauser=await pool.query('SELECT * FROM ivatype where tipo=1 and idcompany=?',[req.user.company])
    //console.log(types)
    res.render('administracion/stock', {types, usertypes, companies, ivablock, ivauser})
    //res.redirect('/pacientes')
})

router.get('/paciente', async (req,res)=>{
    const tiposPaciente=await pool.query('SELECT * FROM patienttype WHERE idcompany is NULL or idcompany=?',[req.user.company])
    //console.log(tiposPaciente)
    res.render('administracion/paciente',{tiposPaciente})
    //res.redirect('/pacientes')
})

router.get('/calendario', async (req,res)=>{
    const tiposCita=await pool.query('SELECT * FROM eventtype WHERE idcompany is NULL or idcompany=?',[req.user.company])
    
    res.render('administracion/calendario',{tiposCita})
    //res.redirect('/pacientes')
})

router.get('/centro', async (req,res)=>{
    const metodosDePagoBlock=await pool.query('SELECT * FROM paymentmethods WHERE tipo=0')
    const metodosDePagoUser=await pool.query('SELECT * FROM paymentmethods WHERE tipo=1 and idcompany=?',[req.user.company])
    const puestosDeTrabajo = await pool.query('SELECT * FROM job WHERE idcompany is NULL or idcompany=? order by nombre asc', [req.user.company])
    const trabajadores=await pool.query('SELECT usuario.*, job.nombre as puesto FROM usuario, job where usuario.puestoTrabajo=job.id and usuario.company=? and (job.idcompany is NULL or job.idcompany=?) ',[req.user.company, req.user.company])
    const center=await pool.query('SELECT * FROM center WHERE id=?', [req.user.company])
    console.log(trabajadores)
    res.render('administracion/centro',{metodosDePagoBlock,metodosDePagoUser, puestosDeTrabajo, trabajadores, center: center[0]})
    //res.redirect('/pacientes')
})

/* AÑADIR TIPO DE PRODUCTO */
router.post('/stock/addProductType',async (req, res) => {
    //console.log(  req.body.tipoProducto)
    let com={
        tipo:1,
        valor: req.body.tipoProducto,
        idcompany: req.user.company
    }

    await pool.query('INSERT INTO producttype SET ?',[com] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo de producto')
            res.send('Error al insertar tipo de producto')
        }else{
            req.flash('success','Tipo de producto añadido correctamente')
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
    await pool.query('UPDATE producttype SET valor = ? WHERE id = ? and tipo=1 and idcompany=?',[req.body.tipoProducto, com, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al editar tipo de producto')
            res.send('Error al editar tipo de producto')
        }else{
            req.flash('success','Tipo de producto editado correctamente')
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR TIPO DE PRODUCTO */
router.get('/stock/deleteProductType/:id',async (req, res) => {
    
    const tp=req.params.id
    await pool.query('DELETE FROM producttype WHERE id = ? and tipo=1 and idcompany=?',[tp, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar tipo de producto')
            res.send('Error al borrar tipo de producto')
        }else{
            req.flash('success','Tipo de producto eliminado correctamente')
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
        valor: req.body.valorIVA,
        idcompany: req.user.company
    }
    await pool.query('INSERT INTO ivatype SET ?',[data] ,function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo de IVA')
            res.send('Error al insertar tipo de IVA')
        }else{
            req.flash('success','Tipo de IVA añadido correctamente')
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
    await pool.query('UPDATE ivatype SET valor = ? WHERE id = ? and tipo=1 and idcompany=?',[data,com, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al editar tipo de IVA')
            res.send('Error al editar tipo de IVA')
        }else{
            req.flash('success','Tipo de IVA editado correctamente')
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR TIPO DE IVA */
router.get('/stock/deleteIVAType/:id',async (req, res) => {
    
    const tp=req.params.id
    await pool.query('DELETE FROM ivatype WHERE id = ? and tipo=1 and idcompany=?',[tp,req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar tipo de IVA')
            res.send('Error al borrar tipo de IVA')
        }else{
            req.flash('success','Tipo de IVA eliminado correctamente')
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
        ambf: ambf,
        idcompany: req.user.company
    }
    console.log(company)
     await pool.query('INSERT INTO companies SET ?',[company], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar empresa')
            res.send('Error al insertar empresa')
        }else{
            req.flash('success','Empresa añadida correctamente')
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
    await pool.query('UPDATE companies SET ? WHERE id = ? and idcompany=?',[company, com,req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al editar Empresa')
            res.send('Error al editar Empresa')
        }else{
            req.flash('success','Empresa editada correctamente')
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

    
})

/* ELIMINAR EMPRESA */
router.get('/stock/deleteCompany/:id',async (req, res) => {
    
    
    await pool.query('DELETE FROM companies WHERE id = ? and idcompany=?',[req.params.id, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar Empresa')
            res.send('Error al borrar Empresa')
        }else{
            req.flash('success','Empresa eliminada correctamente')
            let url='/administracion/stock'
            res.redirect(url)
        }
    })

   
})

/* AÑADIR TIPO DE PACIENTE */
router.post('/paciente/addPatientType',async (req, res) => {
    let data={
        tipo: 1,
        nombre: req.body.nombreTipoPaciente,
        colorTexto: req.body.colorTextoTipoPaciente,
        colorFondo: req.body.colorFondoTipoPaciente,
        idcompany: req.user.company
    }
    await pool.query('INSERT INTO patienttype SET ?',[data], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar tipo Paciente')
            res.send('Error al insertar tipo Paciente')
        }else{
            req.flash('success','Tipo de paciente añadido correctamente')
            let url='/administracion/paciente'
            res.redirect(url)
        }
    })


})

/* AÑADIR MÉTODO DE PAGO */
router.post('/centro/addPaymentMethod',async (req, res) => {
    let data={
        nombre: req.body.nombre,
        tipo: 1,
        idcompany:req.user.company
    }
    await pool.query('INSERT INTO paymentMethods SET ?',[data], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar método de pago')
            res.send('Error al insertar método de pago')
        }else{
            req.flash('success','Método de pago añadido correctamente')
            let url='/administracion/centro'
            res.redirect(url)
        }
    })
})

/* ELIMINAR MÉTODO DE PAGO */
router.get('/centro/deletePaymentMethod/:id',async (req, res) => {
    await pool.query('DELETE FROM paymentMethods WHERE id = ? and tipo=1 and idcompany=?',[req.params.id, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar método de pago')
            res.send('Error al borrar método de pago')
        }else{
            req.flash('success','Método de pago eliminado correctamente')
            let url='/administracion/centro'
            res.redirect(url)
        }
    })
})

/* AÑADIR Puesto de trabajo */
router.post('/centro/addJob',async (req, res) => {
    console.log(req.body)
    const job={
        nombre:req.body.nombre,
        idcompany:req.user.company
    }
    await pool.query('INSERT INTO job SET ?',[job], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar puesto de trabajo')
            res.send('Error al insertar puesto de trabajo')
        }else{
            req.flash('success','Puesto de trabajo añadido correctamente')
            let url='/administracion/centro'
            res.redirect(url)
        }
    })
})

/* ELIMINAR PUESTO DE TRABAJO */
router.get('/centro/deleteJob/:id',async (req, res) => {
    await pool.query('DELETE FROM job WHERE id = ? AND idcompany=?',[req.params.id, req.user.company],function(err, result, fields) {
        if (err) {
            console.log('Error al borrar puesto de trabajo')
            res.send('Error al borrar puesto de trabajo')
        }else{
            req.flash('success','Puesto de trabajo eliminado correctamente')
            let url='/administracion/centro'
            res.redirect(url)
        }
    })
})


/* AÑADIR TRABAJADOR */
router.post('/centro/addWorker',async (req, res) => {
    console.log(req.body)
    let admin=0
    if(req.body.administrator){
        admin=1
    }
    let active=1
    if(!req.body.active){
        active=0
    }
    let password=await helpers.encryptPassword(req.body.validation)
    let data={
        nombre: req.body.nombre,
        primerApellido: req.body.primerApellido,
        segundoApellido: req.body.segundoApellido,
        email: req.body.email,
        puestoTrabajo: req.body.job,
        pass: password,
        active: active,
        isAdmin: admin,
        company: req.user.company

    }
    console.log(data)
    await pool.query('INSERT INTO usuario SET ?',[data], function(err, result, fields) {
        if (err) {
            console.log('Error al insertar trabajador')
            req.flash('error','Error al insertar trabajador')
        }else{
            req.flash('success','Trabajador añadido correctamente')
            let url='/administracion/centro'
            res.redirect(url)
        }
    })
})

/* EDITAR CONTRASEÑA DE USUARIO */
router.post('/centro/editpassword/:id',async (req, res) => {
    if (req.user.isAdmin) {
        let pass1=req.body.validation
        let pass2=req.body.validation2
        if(pass1==pass2){
            let password=await helpers.encryptPassword(req.body.validation)
            await pool.query('UPDATE usuario SET pass=? WHERE id = ? and company=?',[password,req.params.id, req.user.company], function(err, result, fields) {
                if (err) {
                    console.log('Error al cambiar la contraseña')
                    req.flash('error','Error al cambiar la contraseña')
                }else{
                    req.flash('success','Contraseña cambiada correctamente')
                    let url='/administracion/centro'
                    res.redirect(url)
                }
            })

        }else{
            req.flash('error','Las contraseñas no coinciden')
            let url='/administracion/centro'
            res.redirect(url)

        }  
    }
    else{
        req.flash('error','No tiene permiso para cambiar la contraseña')
        let url='/administracion/centro'
        res.redirect(url)
    }
})

/* EDITAR TRABAJADOR */
router.post('/centro/editworker/:id',async (req, res) => {
    if (req.user.isAdmin) {
        let admin=0
        if(req.body.administrator){
            admin=1
        }
        let active=1
        if(!req.body.active){
            active=0
        }
        
        let data={
            nombre: req.body.nombre,
            primerApellido: req.body.primerApellido,
            segundoApellido: req.body.segundoApellido,
            email: req.body.email,
            puestoTrabajo: req.body.job,
            active: active,
            isAdmin: admin

        }
        await pool.query('UPDATE usuario SET nombre=?, primerApellido=?, segundoApellido=?, email=?, puestoTrabajo=?,active=?,isAdmin=? WHERE id = ? AND company=?',[data.nombre, data.primerApellido, data.segundoApellido, data.email, data.puestoTrabajo, data.active, data.isAdmin, req.params.id, req.user.company], function(err, result, fields) {
            if (err) {
                console.log('Error al editar usuario')
                req.flash('error','Error al editar usuario')
                let url='/administracion/centro'
                res.redirect(url)
            }else{
                req.flash('success','Usuario editado correctamente')
                let url='/administracion/centro'
                res.redirect(url)
            }
        })

    }

})

router.post('/centro/imagen',uploadCenter.single('imagen'),async (req, res) => {
    let nombre="centro-"+req.file.originalname
    await pool.query('UPDATE center SET imagen=? WHERE id=?',[nombre, req.user.company])
    
    req.flash('success','Imagen subida correctamente')
    let url='/administracion/centro'
    res.redirect(url)

})
const pool=require('../database')
module.exports =  router