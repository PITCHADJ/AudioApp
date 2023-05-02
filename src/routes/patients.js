const express=require('express')
const router=express.Router()

router.get('/',async (req,res)=>{
    const patients = await pool.query('SELECT * FROM patient')
    //console.log(patients)
    res.render('pacientes', { pats : patients})
    
})

router.get('/paciente/:id', async (req,res)=>{
    console.log('Paciente:',req.params.id)
    const patient = await pool.query('SELECT * FROM patient where id = ?',[req.params.id])
    //console.log(patient)
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
    const histories = await pool.query('SELECT * FROM histories where idusu = ? ORDER BY fechaHistoria DESC, horaHistoria DESC',[req.params.id])
    const comment = await pool.query('SELECT comentario FROM comments where idusu = ? LIMIT 1',[req.params.id])
    let comentario = ''
    if(comment.length == 0){
        comentario=null
    }else{
        comentario=comment[0].comentario
    }
    //console.log(comment[0].comentario)
    res.render('pacientes/paciente',{ patient : patient[0], genero: g, telefonos , emails, histories, tipo: 0, comment: comentario })
    //res.redirect('/pacientes')
})

/**** EDITAR PACIENTE */
router.post('/paciente/edit/:id', async (req,res)=>{
    //console.log('Paciente:',req.params.id)
    const paciente = req.body
   
    await pool.query('UPDATE patient SET ? WHERE id= ?',[paciente, req.params.id], function(err, result, fields) {
        if (err) {
            console.log('Error al editar Paciente')
            res.send('Error al editar Paciente')
        }else{
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

    //res.redirect('/pacientes')
})
/* PRUEBA PARA SELECCIONAR HISTORIAS */
router.get('/paciente/:id/:sel', async (req,res)=>{
    console.log('Paciente:',req.params.id)
    const patient = await pool.query('SELECT * FROM patient where id = ?',[req.params.id])
    //console.log(patient)
    let g=''
    switch (patient[0].genero){
        case 1: g='Mujer'
            break;
        case 3: g='Hombre'
            break;
        default: g='Otro' 
    }
    console.log('Tenemos el tipo:',req.params.sel)
    let tipo = 0
    switch(req.params.sel){
        case 'h': tipo=1
            break;
        case 'v': tipo=2
            break;
        default: tipo = 0
    }
    const telefonos = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=1',[req.params.id])
    const emails = await pool.query('SELECT * FROM contacts where idusu = ? and tipo=2',[req.params.id])
    const histories = await pool.query('SELECT * FROM histories where idusu = ? ORDER BY fechaHistoria DESC, horaHistoria DESC',[req.params.id])
    const comment = await pool.query('SELECT comentario FROM comments where idusu = ? LIMIT 1',[req.params.id])
    let comentario = ''
    if(comment.length == 0){
        comentario=null
    }else{
        comentario=comment[0].comentario
    }

    res.render('pacientes/paciente',{ patient : patient[0], genero: g, telefonos , emails, histories, tipo, comment: comentario })
    //res.redirect('/pacientes')
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
    await pool.query('UPDATE contacts SET valor = ?, comentario = ? WHERE id = ? and idusu = ? ',[req.body.contacto, req.body.comentario, contact, user])
    
    let url='/pacientes/paciente/'+user
    res.redirect(url)
})
    /* ELIMINAR CONTACTO */
router.get('/paciente/deletecontact/:idusu/:id',async (req, res) => {
    const user=req.params.idusu
    const contact=req.params.id
    await pool.query('DELETE FROM contacts WHERE id = ? and idusu = ?',[contact, user])
    //console.log(user,contact)
    
    let url='/pacientes/paciente/'+user
    res.redirect(url)
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
            console.log('Error al insertar comentario')
            res.send('Error al insertar comentario')
        }else{
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})
/* EDITAR COMENTARIO PACIENTE */
router.post('/comment/edit/:id',async (req, res) => {
    await pool.query('UPDATE comments SET comentario = ? WHERE idusu = ?', [req.body.comentario, req.params.id],async function(err, result, fields) {
        if (err) {
            console.log('Error al editar comentario')
            res.send('Error al editar comentario')
        }else{
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})

/* ELIMINAR COMENTARIO PACIENTE */
router.get('/comment/delete/:id',async (req, res) => {
    await pool.query('DELETE FROM comments WHERE idusu = ?', [req.params.id],async function(err, result, fields) {
        if (err) {
            console.log('Error al editar comentario')
            res.send('Error al editar comentario')
        }else{
            let url='/pacientes/paciente/'+req.params.id
            res.redirect(url)
        }
    })

})

/* AÑADIR PACIENTE*/
router.post('/add',async (req, res) => {
    console.log (req.body)
    const paciente = req.body
   
    const datos={
      nombre: paciente.nombre,
      primerApellido: paciente.primerApellido,
      segundoApellido: paciente.segundoApellido,
      fechaNacimiento: paciente.fechaNacimiento,
      DNI: paciente.DNI,
      genero: paciente.genero,
      direccion: paciente.direccion,
      poblacion: paciente.poblacion,
      cp: paciente.cp
  
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
        await pool.query('INSERT INTO contacts (idusu, tipo, valor, comentario) VALUES ?',[contacto],function(err, result, fields) {
          if (err) {
            console.log('Error al insertar contactos')
            res.send('Error al insertar contacto')
          }else{
            // TEnemos que redireccionar al paciente creado
            let url='/pacientes/paciente/'+idusu
            res.redirect(url)
          }
        })
      }
    })  
});


/* EDITAR PACIENTE*/
router.post('/paciente/edit/:id',async (req, res) => {
    console.log (req.body)
    const paciente = req.body
   
    const datos={
      nombre: paciente.nombre,
      primerApellido: paciente.primerApellido,
      segundoApellido: paciente.segundoApellido,
      fechaNacimiento: paciente.fechaNacimiento,
      DNI: paciente.DNI,
      genero: paciente.genero,
      direccion: paciente.direccion,
      poblacion: paciente.poblacion,
      cp: paciente.cp
  
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
        let contacto=[[result.insertId,2,paciente.email],[result.insertId,1,paciente.telefono]]
        console.log(contacto)
        await pool.query('INSERT INTO contacts (idusu, tipo, valor) VALUES ?',[contacto],function(err, result, fields) {
          if (err) {
            console.log('Error al insertar contactos')
            res.send('Error al insertar contacto')
          }else{
            // TEnemos que redireccionar al paciente creado
            let url='/pacientes/paciente/'+idusu
            res.redirect(url)
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
        iddoc: 1,
        contenido: req.body.descripcionHistoria,
        fechaHistoria: req.body.fechaHistoria,
        horaHistoria: req.body.horaHistoria,
        tipo: req.body.tipoHistoria
    }
    await pool.query('INSERT INTO histories SET ?',[hist])
    console.log (hist)
    //res.send('Historia recibida')
    let url='/pacientes/paciente/'+idusu+'/h'
    res.redirect(url)
})

    /* EDITAR HISTORIA */
router.post('/paciente/edithistory/:idusu/:id',async (req, res) => {
    const idusu=req.params.idusu
    const history=req.params.id
    
    const hist={
        idusu: idusu,
        iddoc: 1,
        contenido: req.body.descripcionHistoria,
        fechaHistoria: req.body.fechaHistoria,
        horaHistoria: req.body.horaHistoria,
        tipo: req.body.tipoHistoria
    }
    //console.log(user,history, req.body)
    await pool.query('UPDATE histories SET ? WHERE id = ? and idusu = ? ',[hist, history, idusu])
    
    let url='/pacientes/paciente/'+idusu+'/h'
    res.redirect(url)
    
})
    /* ELIMINAR HISTORIA */
router.get('/paciente/deletehistory/:idusu/:id',async (req, res) => {
    const user=req.params.idusu
    const history=req.params.id
    await pool.query('DELETE FROM histories WHERE id = ? and idusu = ?',[history, user])
    //console.log(user,contact)
    
    let url='/pacientes/paciente/'+user+'/h'
    res.redirect(url)
})


const pool=require('../database')
module.exports =  router