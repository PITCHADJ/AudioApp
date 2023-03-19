const express=require('express')
const router=express.Router()

router.get('/',async (req,res)=>{
    const patients = await pool.query('SELECT * FROM patient')
    console.log(patients)
    res.render('pacientes', { pats : patients})
    
})

router.get(':id', async (req,res)=>{
    console.log(req.params.id)

})


const pool=require('../database')
module.exports =  router