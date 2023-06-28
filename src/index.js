//import express from 'express'
//import {dirname, join} from 'path'
//import {fileURLToPath} from 'url'
//import indexRoutes from './routes/routes.js'
//import morgan from 'morgan'
const express = require('express');
const path = require('path');
//const indexRoutes=require('./routes/routes')
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session')
const mysqlstore=require('express-mysql-session')
const passport=require('passport')




const {database}=require('./keys')


const app= express();
require('./lib/passport')

//middleware
app.use(session({
    secret:'audioapp',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}))
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//variable globales
app.use((req,res,next)=>{
    app.locals.msgsuccess=req.flash('success')
    app.locals.msgerror=req.flash('error')
    app.locals.usersession=req.user
    
    next()
})

//const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Routes
app.use(require('./routes/routes'));
app.use('/auth',require('./routes/authentication'));
app.use('/pacientes',require('./routes/patients'));
app.use('/administracion',require('./routes/administration'));
app.use('/productos',require('./routes/products'));
app.use('/pedidos',require('./routes/orders'));
app.use('/calendario',require('./routes/calendar'));
app.use('/presupuestos',require('./routes/estimates'));
app.use('/ventas',require('./routes/sales'));


//public
app.use(express.static(path.join(__dirname,'public')));


app.set('port',3000);



//Listening server
app.listen(app.get('port'),()=>{console.log('Server is listening on port', app.get('port'))
});
