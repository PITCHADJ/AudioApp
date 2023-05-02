//import express from 'express'
//import {dirname, join} from 'path'
//import {fileURLToPath} from 'url'
//import indexRoutes from './routes/routes.js'
//import morgan from 'morgan'
const express = require('express');
const path = require('path');
//const indexRoutes=require('./routes/routes')
const morgan = require('morgan');


const app= express();

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Routes
app.use(require('./routes/routes'));
app.use(require('./routes/authentication'));
app.use('/pacientes',require('./routes/patients'));
app.use('/administracion',require('./routes/administration'));
app.use('/productos',require('./routes/products'));
app.use('/pedidos',require('./routes/orders'));

//public
app.use(express.static(path.join(__dirname,'public')));


app.set('port',3000);



//Listening server
app.listen(app.get('port'),()=>{console.log('Server is listening on port', app.get('port'))
});
