const express=require('express')
const router=express.Router()

router.get('/',async (req,res)=>{
    const pacientes= await pool.query('SELECT * FROM patient WHERE idcompany=?',[req.user.company])
    const sales = await pool.query('SELECT estimates.*, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=2 and estimates.idpac=patient.id and patient.idcompany=? ORDER BY fecha desc',[req.user.company])
    console.log(sales)
    res.render('ventas',{sales, pacientes, tipop:1})
    
})
/* AÑADIR VENTA */
router.post('/add',async (req,res)=>{
    const companypatient = await pool.query('SELECT idcompany from patient where id=?',[req.body.paciente])

    if(companypatient[0].idcompany == req.user.company){
        const data={    
            idpac: parseInt(req.body.paciente),
            comentario: req.body.comentarioVenta,
            tipo:2
        }
        console.log(data)
        await pool.query('INSERT INTO estimates SET ?',[data],async function(err, result, fields) {
            if (err) {
              console.log('Error al crear venta')
              res.send('Error al crear venta')
            }else{
                idestimate=result.insertId
                let url='/ventas/venta/'+idestimate
                res.redirect(url)
            }
        })
    }else{
        req.flash('Error','No se ha podido añadir la venta')
        res.redirect('/ventas')
    }
    
    
    
})

router.get('/venta/:id',async (req,res)=>{
    const estados= await pool.query('SELECT * FROM estimatesStates')
    const sale= await pool.query('SELECT estimates.id, estimates.idpac, estimates.estado, estimates.comentario, estimates.fecha, estimates.fechamodificacion, patient.nombre, patient.primerApellido, patient.segundoApellido FROM estimates, patient where estimates.tipo=2 and estimates.id=? and estimates.idpac=patient.id LIMIT 1',[req.params.id])
    const productos= await pool.query('SELECT * FROM product where cantidad>0 and idcompany=?', [req.user.company])
    const productosVenta = await pool.query('SELECT dataestimate.*, product.nombre as productnombre, product.precioventa, product.tipoIVA, product.ns, ivatype.nombre as ivanombre, ivatype.valor FROM dataestimate, product, ivatype where dataestimate.idpres=? and dataestimate.idprod=product.id and product.tipoIVA=ivatype.id',[req.params.id])
    const tiposDePagoBlock= await pool.query('SELECT * FROM paymentmethods WHERE tipo=0')
    const tiposDePagoUser= await pool.query('SELECT * FROM paymentmethods WHERE tipo=1 and idcompany=?',[req.user.company])
    /*let tiposDePago=[{
        id:1,
        nombre: "Efectivo"
    },
    {
        id:2,
        nombre: "Tarjeta"
    },
    {
        id:3,
        nombre: "Bizum"
    }]*/
    total=0
    productosVenta.forEach(pro => {
        pro.total = pro.cantidad * pro.precioventa
        console.log("pro", pro)
        let descu=0
        if(pro.iddesc == 1 && pro.descuento>0){
            let i=( pro.descuento / 100 )
            console.log(pro.cantidad, pro.precioventa, i)
            descu=pro.cantidad * pro.precioventa * i
            console.log("descu", descu)
        }else if(pro.iddesc == 2 && pro.descuento>0){
            descu=pro.cantidad * pro.descuento
            console.log("descu", descu)
        }
        pro.descuentoT=descu
        total+=pro.total-descu
        
    });
    if (sale[0].estado==2){
        const pagos= await pool.query('SELECT *, paymentmethods.nombre FROM datapayment,paymentmethods WHERE idsale=? and datapayment.tipo=paymentmethods.id',[req.params.id])
        const nserie= await pool.query('SELECT *, product.nombre FROM serialnumbers, product WHERE idsale=? and idprod=product.id',[req.params.id])
        console.log(pagos)
        res.render('ventas/venta',{sale: sale[0], estados, productos, productosVenta,total, tiposDePagoBlock, tiposDePagoUser, pagos, nserie})
    }else{
        //console.log("Productos",productosVenta) 
        res.render('ventas/venta',{sale: sale[0], estados, productos, productosVenta,total, tiposDePagoBlock, tiposDePagoUser})
    }
    

})

/* AÑADIR PRODUCTO VENTA */
router.post('/venta/addproduct/:id',async (req,res)=>{
    let idsale=req.params.id;
    //console.log(req.body);
    let tipoDesc=req.body.tipoDesc
    let descuento=req.body.descuento
    let producto=await pool.query('SELECT * FROM product WHERE id=? LIMIT 1',[req.body.productoSeleccionado])
    if(tipoDesc==0){
        descuento=0
    }
    console.log(producto[0].precioVenta, descuento, tipoDesc)
    console.log((0 <= producto[0].precioVenta) && (producto[0].precioVenta >= descuento))
    // Si descuento en € comprobamos que no sea mayor que el precio del producto y si es % comprobamos que no sea mayor que 100
    if ((tipoDesc==2 && 0 <= producto[0].precioVenta && producto[0].precioVenta >= descuento) || (tipoDesc==1 && 0 <= descuento && descuento <= 100) || (tipoDesc==0)) {
        let data={
            idpres: idsale,
            idprod: req.body.productoSeleccionado,
            cantidad: req.body.cantidad,
            iddesc: req.body.tipoDesc,
            descuento: descuento
        }
    
        await pool.query('INSERT INTO dataestimate SET ?',[data],async function(err, result, fields) {
            if (err) {
              console.log('Error al añadir producto a la venta')
              res.send('Error al añadir producto a la venta')
            }else{
                req.flash('success','Producto añadido correctamente a la venta')
                let url='/ventas/venta/'+idsale
                res.redirect(url)
            }
        })
    }else{
        res.send('No se cumplen los criterios para agregar producto a la venta')
    }
    
})

/* ELIMINAR PRODUCTO DE VENTA */
router.get('/venta/deleteProductSale/:id/:idsale',async (req,res)=>{
    
    let idsale=req.params.idsale
    let id=req.params.id
    await pool.query('DELETE FROM dataestimate WHERE id = ?',[id],function(err, result, fields) {
        if (err) {
            console.log('Error al eliminar producto de la venta')
            res.send('Error al eliminar producto de la venta')
        }else{
            req.flash('success','Producto eliminado correctamente de la venta')
            let url='/ventas/venta/'+idsale
            res.redirect(url)
        }
    })
})

/* EDITAR PRODUCTO DE VENTA */
router.post('/venta/editProduct/:id/:idsale', async (req,res)=>{
    let idsale=req.params.idsale;
    
    let tipoDesc=req.body.tipoDesc
    let descuento=req.body.descuento
    let producto=await pool.query('SELECT * FROM product WHERE id=? LIMIT 1',[req.body.productoSeleccionado])
    if(tipoDesc==0){
        descuento=0
    }
    
    // Si descuento en € comprobamos que no sea mayor que el precio del producto y si es % comprobamos que no sea mayor que 100
    if ((tipoDesc==2 && 0 <= producto[0].precioVenta && producto[0].precioVenta >= descuento) || (tipoDesc==1 && 0 <= descuento && descuento <= 100) || (tipoDesc==0)) {
            
        await pool.query('UPDATE dataestimate SET idprod=?, cantidad=?, iddesc=?, descuento=? WHERE id=? and idpres=? ',[req.body.productoSeleccionado, req.body.cantidad, req.body.tipoDesc, descuento, req.params.id, req.params.idsale],async function(err, result, fields) {
            if (err) {
              console.log('Error al editar producto de la venta')
              res.send('Error al editar producto de la venta')
            }else{
                req.flash('success','Producto de venta editado correctamente')
                let url='/ventas/venta/'+idsale
                res.redirect(url)
            }
        })
    }else{
        res.send('No se cumplen los criterios para agregar producto a la venta')
    }

})

/*ELIMINAR VENTA */
router.get('/venta/delete/:idsale',async (req,res)=>{
    const patientcompany = await pool.query('SELECT idcompany FROM patient, estimates WHERE estimates.id=? and estimates.idpac=patient.id',[req.params.idsale])
    if(patientcompany[0].idcompany == req.user.company){
        await pool.query('DELETE FROM estimates WHERE id = ? and tipo=2',[req.params.idsale],function(err, result, fields) {
            if (err) {
                console.log('Error al eliminar venta')
                res.send('Error al eliminar venta')
            }else{
                req.flash('success','Venta eliminada correctamente')
                
                res.redirect('/ventas')
            }
        })
    }
    

})

/* ACEPTAR VENTA */
router.post('/venta/acceptSale/:idsale',async (req,res)=>{
    console.log(req.body)
    /*coger valor de la venta para comprobar que el pago es correcto*/
    const paciente=await pool.query('SELECT idpac, tipo FROM estimates WHERE tipo=2 and id=?',[req.params.idsale])
    if(paciente.length > 0){
        const productosVenta = await pool.query('SELECT dataestimate.*, product.nombre as productnombre, product.precioventa, product.tipoIVA, product.ns, ivatype.nombre as ivanombre, ivatype.valor FROM dataestimate, product, ivatype where dataestimate.idpres=? and dataestimate.idprod=product.id and product.tipoIVA=ivatype.id',[req.params.idsale])
        let total=0
        productosVenta.forEach(pro => {
            pro.total = pro.cantidad * pro.precioventa
            let descu=0
            if(pro.iddesc == 1 && pro.descuento>0){
                let i=( pro.descuento / 100 )
                descu=pro.cantidad * pro.precioventa * i
            }else if(pro.iddesc == 2 && pro.descuento>0){
                descu=pro.cantidad * pro.descuento
            }
            total+=pro.total-descu
            
        })
        console.log(total)

        let nprod=req.body.idprod.length
        let nserie=[]
        let npagos=[]
        let totalpagos=0
        if(Array.isArray(req.body.idprod)){
            console.log('ids es array')
            for(let i=0; i< nprod ; i++){
                let p={
                    idprod:req.body.idprod[i],
                    nserie:req.body.ns[i]
                }
                
                nserie.push(p)
            }
        }else{
            let p={
                idprod:req.body.idprod,
                nserie:req.body.ns
            }
            nserie.push(p)
        }
        if(parseInt(req.body.npagos) >1){
            console.log('npagos es array')
            for(let j=0; j<req.body.npagos; j++){
                let p={
                    idTipoPago:req.body.metodopago[j],
                    total:req.body.pago[j]
                }
                totalpagos+=parseFloat(p.total)
                npagos.push(p)
            }
        }else{
            let p={
                idTipoPago:req.body.metodopago,
                total:req.body.pago
            }
            totalpagos+= parseFloat(p.total)
            npagos.push(p)
        }
        console.log(total, totalpagos)
        if(total == totalpagos){
            console.log("El pago es completo")
            /*añadir numeros de serie a paciente idpac, idproducto, nserie, fechaventa*/
            nserie.forEach(async p => {
                await pool.query('INSERT INTO serialnumbers SET idpac=?, idprod=?, nserie=?, idsale=?',[paciente[0].idpac,p.idprod,p.nserie, req.params.idsale],async function(err, result, fields) {
                    if (err) {
                        console.log('Error al añadir numero de serie de producto')
                        req.flash('error','Error al añadir numero de serie de producto')
                        let url='/ventas/venta/'+req.params.idsale
                        res.redirect(url)
                    }
                })
            });
                       
            /*crear datos de la venta cerrada */

            npagos.forEach(async p =>{
                await pool.query('INSERT INTO datapayment SET idsale=?, tipo=?, cantidad=?',[req.params.idsale, p.idTipoPago, p.total],async function(err, result, fields) {
                    if (err) {
                        console.log('Error al añadir el tipo de pago de la venta')
                        req.flash('error','Error al añadir el tipo de pago de la venta')
                        let url='/ventas/venta/'+req.params.idsale
                        res.redirect(url)
                    }
                })
            })

            /* cambiar estado de la venta a cerrada */
            await pool.query('UPDATE estimates SET estado = 2 WHERE tipo=2 and id=?',[req.params.idsale],async function(err, result, fields) {
                if (err) {
                    console.log('Error al actualizar estado de la venta')
                    req.flash('error','Error al actualizar estado de la venta')
                    let url='/ventas/venta/'+req.params.idsale
                    res.redirect(url)
                }else{
                    req.flash('success','Venta actualizada correctamente')
                    let url='/ventas/venta/'+req.params.idsale
                    res.redirect(url)
                }
            })

        }else{
            console.log("El pago no está completo")
            req.flash('error','El total del pago indicado no corresponde con el total de la venta')
                    let url='/ventas/venta/'+req.params.idsale
                    res.redirect(url)

        }
    }else{
        console.log("Error en la petición")
        req.flash('error','Error en la petición cliente venta')
        let url='/ventas/venta/'+req.params.idsale
        res.redirect(url) 
    }
    
    

   
})

const pool=require('../database')
module.exports =  router