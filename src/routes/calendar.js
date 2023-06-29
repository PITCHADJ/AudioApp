const express=require('express')
const router=express.Router()

function parserEventos (eventos){
    let evnts=[]
    let cuerpos=[]
    /*let ev={
        id: 'a',
        title: 'my event',
        description: "Primera revisión",
        start: '2023-05-06T10:30:00.000Z',
        end: '2023-05-06T12:30:00.000Z',
        editable: true,
        url: '#modalEditEvent',
        backgroundColor: 'red'
    }*/
    
    eventos.forEach( evento => {
        
        let day = ("0" + evento.fecha.getDate()).slice(-2);
        let month = ("0" + (evento.fecha.getMonth() + 1)).slice(-2);
        let year = (evento.fecha.getYear()+1900);
       
        let i=year+"-"+month+"-"+day+"T"+evento.horaInicio+".000Z"
        let fin=year+"-"+month+"-"+day+"T"+evento.horaFin+".000Z"
       
        
        let pac= evento.nombre +" "+ evento.primerApellido +" "+ evento.segundoApellido
        //let cuerpo= "<div class=\"fc-event-main-frame\"> <div class=\"fc-event-time\">"+evento.horaInicio.toString()+" - "+ evento.horaFin.toString() +"</div> <div class=\"fc-event-title-container\"> <div class=\"fc-event-title fc-sticky\">"+pac
        

        let ev={
            id:evento.id,
            title:pac,
            description:evento.comentario,
            start: i,
            end:fin,
            //url:'',
            backgroundColor: evento.color,
            extendedProps: {
                idpac: evento.paciente,
                idWorker: evento.asignada,
                doctor: evento.unombre + " "+ evento.uprimerapellido,
                tipo: evento.tipo
            }
        }
        /*let ee={
            id:evento.id,
            cuerpo:cuerpo
        }*/
        
        evnts.push(ev)
        //cuerpos.push(ee)
        
    });
    
    console.log(evnts)
    //return [evnts, cuerpos]
    return evnts

}

router.get('/',async (req,res)=> {
    const pacientes = await pool.query('SELECT * FROM patient WHERE idcompany=?',[req.user.company])
    /*let atiende=[{
        id:1,
        identificadorCita: "Johanna"
    }]*/
    let usuarios =await pool.query('SELECT * FROM usuario where company=?',[req.user.company])
    let atiende =[]
    usuarios.forEach(u => {
        let a = {
            id: u.id,
            identificadorCita: u.nombre +" "+ u.primerApellido + " "+ u.segundoApellido
        }
        atiende.push(a)
    }); 
    const eventos = await pool.query('SELECT event.*, usuario.nombre as unombre, usuario.primerapellido as uprimerapellido, usuario.segundoapellido as usegundoapellido, patient.nombre, patient.primerApellido, patient.segundoApellido, eventtype.color FROM event, patient, eventtype, usuario where event.paciente=patient.id and event.tipo=eventtype.id and event.asignada=usuario.id and patient.idcompany=?',[req.user.company])
    const tipoCita= await pool.query('SELECT * FROM eventtype where idcompany is NULL or idcompany=?',[req.user.company])
    let evnts=parserEventos(eventos)
    
    console.log("eventos",evnts[0])
    //console.log("cuerpos",evnts[1])
    res.render('calendario',{prueba: "Hola", pacientes, atiende, evnts, tipoCita})
});

router.post('/addEvent',async (req,res)=> {
    
    let data={
        paciente:req.body.paciente,
    	fecha:req.body.fechaEvento,
        horaInicio:req.body.horaInicioEvento,
        horaFin:req.body.horaFinEvento,
        asignada:req.body.atiende,
        comentario:req.body.comentarioEvento,
        tipo:req.body.tipoCita
    }
    console.log(data)
    await pool.query('INSERT INTO event SET ?',[data],async function(err, result, fields) {
        if (err) {
            console.log('Error al insertar Evento')
            res.send('Error al insertar Evento')
        }else{
            res.redirect('/calendario')
        }
    })
    
});

router.post('/editEvent/:id',async (req,res)=> {
    const eventid=req.params.id
    //console.log("hola",eventid, req.body)
    let data=[
        req.body.paciente,
        req.body.tipoCita,
    	req.body.fechaEditEvent,
        req.body.horaInicioEditEvent,
        req.body.horaFinEditEvent,
        req.body.atiende,
        req.body.comentarioEditEvent,
        eventid
    ]
    //console.log(data)
    await pool.query('UPDATE event SET paciente=? , tipo=? , fecha=?, horaInicio=?, horaFin=?, asignada=?, comentario=? WHERE id=?',data,async function(err, result, fields) {
        if (err) {
            console.log('Error al Editar Evento')
            res.send('Error al Editar Evento')
        }else{
            res.redirect('/calendario')
        }
    })
    //res.redirect('/calendario')
});


const pool=require('../database')
module.exports =  router