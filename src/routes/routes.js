//import {Router} from 'express'

const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>res.render('index'))
router.get('/contact',(req,res)=>res.render('contact'))
router.get('/about',(req,res)=>res.render('about'))
router.get('/formulario',(req,res)=>res.render('formulario'))



router.post('/menu',async (req, res) => {
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
  await pool.query('INSERT INTO patient SET ?',[datos],async function(err, result, fields) {
    if (err) {
      console.log('Error al insertar paciente')
      res.send('Error al insertar paciente')
    }else{
      console.log('numero de paciente:',result.insertId);
      let contacto=[[result.insertId,2,paciente.email],[result.insertId,1,paciente.telefono]]
      console.log(contacto)
      await pool.query('INSERT INTO contacto (idusu, tipo, valor) values ?',[contacto],function(err, result, fields) {
        if (err) {
          console.log('Error al insertar contactos')
          res.send('Error al insertar contacto')
        }else{
          res.redirect('pacientes')
        }
      })
    }
  })  
  
  
  //res.send('Paciente insertado')
  
    
  });

  router.post('/formulario',async (req, res) => {
    const {nom, ap, email, tel} = req.body;
    const newAd ={
      nom,
      ap,
      email,
      tel
    };
    console.log(newAd)
    await pool.query('INSERT INTO patient set ?',[newAd])
    res.send('Recibido formulario')
    
  });


const pool=require('../database')
module.exports =  router
