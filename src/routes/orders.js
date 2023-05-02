const express=require('express')
const router=express.Router()


router.get('/',async (req,res)=> {
    res.render('pedidos')
});


const pool=require('../database')
module.exports =  router