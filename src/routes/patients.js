const express=require('express')
const router=express.Router()

const multer = require('multer')
var fs = require('fs');

const storageUsers = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.user.company)
        var dir = 'src/public/img/users/'+req.params.id;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
        console.log(req)
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storageUsers })

/* GET PACIENTES */
router.get('/',async (req,res)=>{
    const patients = await pool.query('SELECT patient.*, patientType.id as ptid, patientType.nombre as ptnombre, patientType.colorTexto, patientType.colorFondo FROM patient, patientType where patient.idcompany=? and patient.patientType=patienttype.id order by id asc',[req.user.company])
    const tiposPaciente=await pool.query('SELECT * FROM patientType WHERE idcompany is NULL or idcompany=?',[req.user.company])
    //console.log(patients)
    res.render('pacientes', { pats : patients, tiposPaciente})
    
})

/* GET PACIENTE */
router.get('/paciente/:id', async (req,res)=>{
    console.log('Paciente:',req.params.id)
    const patient = await pool.query('SELECT patient.*, patientType.id as ptid, patientType.nombre as ptnombre, patientType.colorTexto, patientType.colorFondo FROM patient, patientType where patient.id = ? and patient.idcompany=? and patient.patientType=patienttype.id',[req.params.id, req.user.company])
    
    if(patient){
        let g=''
        switch (patient[0].genero){
            case 1: g='Mujer'
                break;
            case 2: g='Hombre'
                break;
            default: g='Otro' 
        }
        //console.log(g)
    
        const telefonos = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=1',[req.params.id])
        const emails = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=2',[req.params.id])
        const histories = await pool.query('SELECT histories.*, usuario.nombre, usuario.primerapellido, usuario.segundoapellido FROM histories, usuario where histories.idusu = ? and histories.iddoc=usuario.id ORDER BY fechaHistoria DESC, horaHistoria DESC',[req.params.id])
        const comment = await pool.query('SELECT comentario FROM comments where idusu = ? LIMIT 1',[req.params.id])
        const pedidos =await pool.query('SELECT * FROM orders where idpac = ? order by fechaModificacion desc',[req.params.id])
        const estimates = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=1 and patient.id=estimates.idpac and patient.id = ? order by estimates.fecha desc',[req.params.id, req.params.id])
        const sales = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=2 and patient.id=estimates.idpac and patient.id = ? order by estimates.fecha desc',[req.params.id, req.params.id])
        const tiposPaciente=await pool.query('SELECT * FROM patientType WHERE idcompany is NULL or idcompany=?', [req.user.company])
        const companies = await pool.query('SELECT * FROM companies where ambp=1 and idcompany=?', [req.user.company])
        const nserie= await pool.query('SELECT *, product.nombre FROM serialnumbers, product WHERE idpac=? and idprod=product.id',[req.params.id])
        console.log(nserie)
        let orders=[]
        pedidos.forEach(p =>{
            let pedido={
                id:p.id,
                para:'',
                estado:p.estado,
                referencia:p.referencia,
                fechaCreacion:p.fechaCreacion,
                fechaModificacion:p.fechaModificacion
            }
            if(p.tipo==0){
                pedido.para="Empresa"
            }else{
                pedido.para = patient[0].nombre+" "+patient[0].primerApellido+" "+patient[0].segundoApellido
            }
            orders.push(pedido)
    
        })
        let comentario = ''
        if(comment.length == 0){
            comentario=null
        }else{
            comentario=comment[0].comentario
        }
        //console.log(comment[0].comentario)
        res.render('pacientes/paciente',{ patient : patient[0], genero: g, telefonos , emails, histories, tipo: 0, comment: comentario, orders, tipop:0, estimates, sales, tiposPaciente, companies, nserie })
        //res.redirect('/pacientes')
    }else{
        res.redirect('/pacientes')
    }
   
})

/**** EDITAR PACIENTE */
router.post('/paciente/edit/:id', async (req,res)=>{
    
    const paciente = req.body
    console.log("paciente editado", paciente)
   
    await pool.query('UPDATE patient SET ? WHERE id= ? and idcompany=?',[paciente, req.params.id, req.user.company], function(err, result, fields) {
        if (err) {
            console.log('Error al editar Paciente')
            res.send('Error al editar Paciente')
        }else{
            req.flash('success','Paciente editado correctamente')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })   
})

/* PRUEBA PARA SELECCIONAR HISTORIAS */
router.get('/paciente/:id/:sel', async (req,res)=>{
    console.log('Paciente:',req.params.id)
    const patient = await pool.query('SELECT * FROM patient where id = ? and idcompany=?',[req.params.id, req.user.company])
    //console.log(patient)
    if (patient){
        let g=''
        switch (patient[0].genero){
            case 1: g='Mujer'
                break;
            case 3: g='Hombre'
                break;
            default: g='Otro' 
        }
        //console.log('Tenemos el tipo:',req.params.sel)
        let tipo = 0
        switch(req.params.sel){
            case 'h': tipo=1
                break;
            case 'v': tipo=2
                break;
            case 'pr': tipo=3
                break;
            case 'p': tipo=4
                break;
            case 'f': tipo=6
                break;
            default: tipo = 0
        }
        //console.log('Tenemos el tipo:',tipo)
        const telefonos = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=1',[req.params.id])
        const emails = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=2',[req.params.id])
        const histories = await pool.query('SELECT histories.*, usuario.nombre, usuario.primerapellido, usuario.segundoapellido FROM histories, usuario where histories.idusu = ? and histories.iddoc=usuario.id ORDER BY fechaHistoria DESC, horaHistoria DESC',[req.params.id])
        const comment = await pool.query('SELECT comentario FROM comments where idusu = ? LIMIT 1',[req.params.id])
        const pedidos =await pool.query('SELECT * FROM orders where idpac = ? ORDER BY fechaModificacion desc',[req.params.id])
        const estimates = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=1 and patient.id=estimates.idpac and patient.id = ? order by estimates.fecha desc',[req.params.id, req.params.id])
        const sales = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=2 and patient.id=estimates.idpac and patient.id = ? order by estimates.fecha desc',[req.params.id, req.params.id])
        const tiposPaciente=await pool.query('SELECT * FROM patientType WHERE idcompany is NULL or idcompany=?', [req.user.company])
        const companies = await pool.query('SELECT * FROM companies where ambp=1 and idcompany=?', [req.user.company])
        const nserie= await pool.query('SELECT *, product.nombre FROM serialnumbers, product WHERE idpac=? and idprod=product.id',[req.params.id])
        let orders=[]
        pedidos.forEach(p =>{
            let pedido={
                id:p.id,
                para:'',
                estado:p.estado,
                referencia:p.referencia,
                fechaCreacion:p.fechaCreacion,
                fechaModificacion:p.fechaModificacion
            }
            if(p.tipo==0){
                pedido.para="Empresa"
            }else{
                pedido.para = patient[0].nombre+" "+patient[0].primerApellido+" "+patient[0].segundoApellido
            }
            orders.push(pedido)
    
        })
    
    
       
    
        let comentario = ''
        if(comment.length == 0){
            comentario=null
        }else{
            comentario=comment[0].comentario
        }
    
        res.render('pacientes/paciente',{ patient : patient[0], genero: g, telefonos , emails, histories, tipo, comment: comentario, orders, tipop:0, estimates, sales, tiposPaciente, companies, nserie })
        //res.redirect('/pacientes')
    }else{
        res.redirect('/pacientes')
    }
    
})
/********************************************** */


/*** CONTACTOS** */
router.post('/contacto/add/:id',async (req, res) => {
   
    const datos= {
        idusu: req.params.id,
        tipo: req.body.contacto[0],
        valor: req.body.contacto[1],
        comentario: req.body.comentario
    }
    //console.log('Paciente:',  datos)
    await pool.query('INSERT INTO contacts SET ?',[datos],async function(err, result, fields) {
        if (err) {
            console.log('Error al insertar contacto')
            res.send('Error al insertar contacto')
        }else{
            req.flash('success','Contacto añadido correctamente')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

    //res.send('Voy a enviar los datos del paciente')
})

    /* EDITAR CONTACTO */
router.post('/paciente/editcontact/:idusu/:id',async (req, res) => {
    const user=req.params.idusu
    const contact=req.params.id
    
    //console.log(user,contact, req.body.contacto)
    await pool.query('UPDATE contacts SET valor = ?, comentario = ? WHERE id = ? and idusu = ? ',[req.body.contacto, req.body.comentario, contact, user],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al editar el contacto')
            let url='/pacientes/paciente/'+user
            res.redirect(url)
        }else{
            req.flash('success','Contacto editado correctamente')
            let url='/pacientes/paciente/'+user
            res.redirect(url)
        }
    })
   
})
    /* ELIMINAR CONTACTO */
router.get('/paciente/deletecontact/:idusu/:id',async (req, res) => {
    const user=req.params.idusu
    const contact=req.params.id
    await pool.query('DELETE FROM contacts WHERE id = ? and idusu = ?',[contact, user],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al eliminar el contacto')
            let url='/pacientes/paciente/'+user
            res.redirect(url)
        }else{
            req.flash('success','Contacto eliminado correctamente')
            let url='/pacientes/paciente/'+user
            res.redirect(url)
        }
    })
    //console.log(user,contact)
    
})

/* AÑADIR COMENTARIO PACIENTE */

router.post('/comment/add/:id',async (req, res) => {
    const datos= {
        idusu: req.params.id,
        comentario: req.body.comentario
    }
    console.log(datos)
    await pool.query('INSERT INTO comments SET ?',[datos],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al añadir comentario')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }else{
            req.flash('success','Comentario añadido correctamente')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})
/* EDITAR COMENTARIO PACIENTE */
router.post('/comment/edit/:id',async (req, res) => {
    await pool.query('UPDATE comments SET comentario = ? WHERE idusu = ?', [req.body.comentario, req.params.id],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al editar comentario')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }else{
            req.flash('success','Comentario editado correctamente')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})

/* ELIMINAR COMENTARIO PACIENTE */
router.get('/comment/delete/:id',async (req, res) => {
    await pool.query('DELETE FROM comments WHERE idusu = ?', [req.params.id],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al eliminar comentario')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }else{
            req.flash('success','Comentario eliminado correctamente')
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})


/* AÑADIR PACIENTE*/
router.post('/add',async (req, res) => {
    console.log (req.body)
    const paciente = req.body
    let np=await pool.query('SELECT nextpaciente FROM center WHERE id=?',[req.user.company])
    const datos={
      nombre: paciente.nombre,
      primerApellido: paciente.primerApellido,
      segundoApellido: paciente.segundoApellido,
      fechaNacimiento: paciente.fechaNacimiento,
      DNI: paciente.DNI,
      genero: paciente.genero,
      direccion: paciente.direccion,
      poblacion: paciente.poblacion,
      cp: paciente.cp,
      patientType: paciente.patientType,
      idcompany: req.user.company,
      ncliente: np[0].nextpaciente
 
    }
    console.log(datos)
    let idusu=0
    await pool.query('INSERT INTO patient SET ?',[datos],async function(err, result, fields) {
      if (err) {
        console.log('Error al insertar paciente')
        res.send('Error al insertar paciente')
      }else{
        idusu=result.insertId
        console.log('numero de paciente:',result.insertId);
        let contacto=[[result.insertId,2,paciente.email,"Principal"],[result.insertId,1,paciente.telefono,"Principal"]]
        console.log(contacto)
        await pool.query('INSERT INTO contacts (idusu, tipo, valor, comentario) VALUES ?',[contacto],async function(err, result, fields) {
          if (err) {
            console.log('Error al insertar contactos')
            res.send('Error al insertar contacto')
          }else{
            let sigPac=np[0].nextpaciente + 1
            await pool.query('UPDATE center SET nextpaciente=? where id=?',[sigPac,req.user.company],function(err, result, fields) {
                if (err) {
                    let url='/pacientes'
                    res.redirect(url)
                  }else{
                    let url='/pacientes/paciente/'+idusu
                    res.redirect(url)
                  }
            })
          }
        })
      }
    })  
});


/**** HISTORIAS */
router.post('/paciente/historia/add/:id',async (req, res) => {
    const idusu=req.params.id
    const hist={
        idusu: idusu,
        iddoc: req.user.id,
        contenido: req.body.descripcionHistoria,
        fechaHistoria: req.body.fechaHistoria,
        horaHistoria: req.body.horaHistoria,
        tipo: req.body.tipoHistoria
    }
    await pool.query('INSERT INTO histories SET ?',[hist],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al añadir historia')
            let url='/pacientes/paciente/'+idusu+'/h'
            res.redirect(url)
        }else{
            req.flash('success','Historia añadida correctamente')
            let url='/pacientes/paciente/'+idusu+'/h'
            res.redirect(url)
        }
    })
    
    //res.send('Historia recibida')
    
})

    /* EDITAR HISTORIA */
router.post('/paciente/edithistory/:idusu/:id',async (req, res) => {
    const idusu=req.params.idusu
    const history=req.params.id
    
    const hist={
        idusu: idusu,
        iddoc: req.user.id,
        contenido: req.body.descripcionHistoria,
        fechaHistoria: req.body.fechaHistoria,
        horaHistoria: req.body.horaHistoria,
        tipo: req.body.tipoHistoria
    }
    //console.log(user,history, req.body)
    await pool.query('UPDATE histories SET ? WHERE id = ? and idusu = ? ',[hist, history, idusu],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al editar historia')
            let url='/pacientes/paciente/'+idusu+'/h'
            res.redirect(url)
        }else{
            req.flash('success','Historia editada correctamente')
            let url='/pacientes/paciente/'+idusu+'/h'
            res.redirect(url)
        }
    })
    
    
})
    /* ELIMINAR HISTORIA */
router.get('/paciente/deletehistory/:idusu/:id',async (req, res) => {
    const user=req.params.idusu
    const history=req.params.id
    await pool.query('DELETE FROM histories WHERE id = ? and idusu = ?',[history, user],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al eliminar historia')
            let url='/pacientes/paciente/'+user+'/h'
            res.redirect(url)
        }else{
            req.flash('success','Historia eliminada correctamente')
            let url='/pacientes/paciente/'+user+'/h'
            res.redirect(url)
        }
    })
    //console.log(user,contact)
    
})

/* AÑADIR VENTA */
router.post('/paciente/venta/add/:id',async (req, res) => {

    const data={    
        idpac: parseInt(req.params.id),
        comentario: req.body.comentarioVenta,
        estado:1,
        tipo:2
    }
    console.log(data)
    await pool.query('INSERT INTO estimates SET ?',[data],async function(err, result, fields) {
        if (err) {
            idusu=req.params.id
            req.flash('error','Error al crear Venta')
            let url='/pacientes/paciente/'+idusu+'/v'
            res.redirect(url)
        }else{
            idusu=req.params.id
            req.flash('success','Venta creada correctamente')
            let url='/pacientes/paciente/'+idusu+'/v'
            res.redirect(url)
        }
    })   
})

/* AÑADIR PRESUPUESTO */
router.post('/paciente/presupuesto/add/:id',async (req, res) => {
    let idusu=req.params.id
    let url='/pacientes/paciente/'+idusu+'/pr'
    const data={    
        idpac: parseInt(req.params.id),
        comentario: req.body.comentarioPresupuesto,
        tipo:1
    }
    console.log(data)
    await pool.query('INSERT INTO estimates SET ?',[data],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al crear presupuesto')
            res.redirect(url)
        }else{
            req.flash('success','Presupuesto creado correctamente')
            res.redirect(url)
        }
    })   
})

/* AÑADIR PEDIDO */
router.post('/paciente/pedido/add/:id',async (req, res) => {
    
    let idusu=req.params.id
    let url='/pacientes/paciente/'+idusu+'/p'
    const data={    
        idpac:idusu,
        tipo: 1,
        referencia: req.body.refOrder,
        idcomp: req.body.company,
        idcompany: req.user.company
    }
    console.log(data)
    await pool.query('INSERT INTO orders SET ?',[data],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al crear el pedido')
            res.redirect(url)
        }else{
            req.flash('success','Pedido creado correctamente')
            res.redirect(url)
        }
    })   
})

/*ELIMINAR PEDIDO PACIENTE */
router.get('/paciente/pedido/delete/:id/:idusu',async (req, res) => {
    let idusu=req.params.idusu
    let url='/pacientes/paciente/'+idusu+'/p'
    await pool.query('DELETE FROM orders WHERE id= ? and idpac=? and idcompany=?',[req.params.id, idusu, req.user.company],async function(err, result, fields) {
        if (err) {
            req.flash('error','Error al eliminar el pedido')
            res.redirect(url)
          }else{
            req.flash('success','Pedido eliminado correctamente')   
            res.redirect(url)
          }
    })
    
})



router.post('/paciente/:id/uploadfiles',upload.array('imagenes',100), async (req, res) => {
    console.log(req.body)
    let idusu = req.params.id
    let url='/pacientes/paciente/'+idusu+'/f'
    res.redirect(url)
})


const pool=require('../database')
module.exports =  router