//import {Router} from 'express'

const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>res.render('index'))
router.get('/contact',(req,res)=>res.render('contact'))
router.get('/about',(req,res)=>res.render('about'))
router.get('/menu',(req,res)=>res.render('menu'))
router.get('/formulario',(req,res)=>res.render('formulario'))

router.post('/menu',async (req, res) => {
  console.log (req.body)
  const {nombre, apellidos, email, telefono} = req.body;
  const newAd ={
    nombre,
    apellidos,
    email,
    telefono
  };
  console.log(newAd)
  await pool.query('INSERT INTO patient SET ?',[newAd], function(err, result, fields) {
    if (err) {
        
        console.log('Error al insertar paciente')
      }else{
          
        console.log(result.insertId);
        res.send('Recibido modal paciente')
      }
  })
  
    
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
