$('#modalAddHistory').on('shown.bs.modal', function (e) {
    
   var now = new Date();
   var day = ("0" + now.getDate()).slice(-2);
   var month = ("0" + (now.getMonth() + 1)).slice(-2);

   var today = now.getFullYear()+"-"+(month)+"-"+(day);
   //alert(today);
   $('#fechaHistoria').val(today);
    var hora=("0"+now.getHours()).slice(-2)
    var min=("0"+now.getMinutes()).slice(-2)
    $('#horaHistoria').val(hora+":"+min)
   //alert(hora+"-"+min)
})

$('input:checkbox[name="ns"]').change(
   function(){
      //alert(this.checked)
      
       if (this.checked ) {
            var n=$( '#cantidad' ).val();
            alert(n)
           // note that, as per comments, the 'changed'
           // <input> will *always* be checked, as the change
           // event only fires on checking an <input>, not
           // on un-checking it.
           // append goes here
       }
   });

   $("#comentarioEvento").on("change keypress input", function() {
      //console.log(($("#comentarioEvento").val()).length)
      $("#spanComentarioEvento").text( (($("#comentarioEvento").val()).length)+"/100"  );
  });
  
  $("#comentarioEditEvent").on("change keypress input", function() {
   //console.log(($("#comentarioEditEvent").val()).length)
   $("#spanComentarioEditEvento").text( (($("#comentarioEditEvent").val()).length)+"/100"  );
});

$('#radioPaciente').change(
   function(){
      if(this.checked){
         $("#selectPacienteOrder").show();
         //alert("Radio Paciente!");
      }
   }
)
$('#radioEmpresa').change(
   function(){
      if(this.checked){
         $("#selectPacienteOrder").hide();
         //alert("Radio Empresa!");
      }
   }
)

if($('#radioEmpresa').is(":checked")){
   $("#selectPacienteOrder").hide();
}

$( "#botonAnyadirElemento" ).on( "click", function() {
   let pr=JSON.parse(products)
   total+=1
   let prds='<option value="" selected disabled>Seleccione producto</option>'
    //let products=JSON.parse('<%- JSON.stringify(products) %>')
    console.log(products)
    pr.forEach(p => {
      prds+='<option value="'+p.id+'">'+p.nombre+" - "+(p.precioVenta).toLocaleString("es-ES", { style: "currency", currency: "EUR" })+'</option>'
    });
    let ht= '<div class="row" id="fila'+total+'">'
    ht +='<div class="col-md-5">'
    
    ht += '<select class="form-select" name="producto" id="selectProducto" required>'
    ht += prds
    ht += '</select>'
    ht += '</div>'
    ht +='<div class="col-md-2">'
    ht += '<input type="number" class="form-control" placeholder="Cantidad" name="cantidad" required>'
    ht += '</div>'
    ht +='<div class="col-md-4">'
    ht += '<input type="text" class="form-control" placeholder="Comentario" name="comentario">'
    ht += '</div>'
    ht +='<div class="col-md-1">'
    ht += '<a href="#" onClick="deleteFila('+total+')"><i class="fas fa-trash"></i></a>'
    ht += '</div>'
    ht += '</div>'
    ht += '<br id="br'+total+'">'
    
    $('#elementosPedido').append(ht)
    
    console.log(total)
    
    
    //alert( "Handler for `click` called." );
 } );

 function deleteFila(nFila){
   let fila="fila"+nFila
   let br = "br"+nFila
   console.log(fila)
   
   $( "#"+fila ).remove();
   $("#"+br).remove();

 }

 $('#borrarFila').on('click', function(){
   //$(this).closest("#clients-edit-wrapper").remove();
   console.log(this)
   });


   $("#nombreTipoPaciente").on("change keypress input", function() {
      $('#ejemploTipo').val($("#nombreTipoPaciente").val())
      $("#spanNombreTipoPaciente").text( (($("#nombreTipoPaciente").val()).length)+"/30"  );
      if(($("#nombreTipoPaciente").val()).length > 30 ){
         $('#botonCrearTipoPaciente').prop('disabled', true)
      }else{
         $('#botonCrearTipoPaciente').prop('disabled', false)
      }
      //console.log($("#nombreTipoPaciente").val())

   })

   $("#colorTextoTipoPaciente").on("change", function() {
      //console.log($("#colorTextoTipoPaciente").val())
      $('#ejemploTipo').css('color',$("#colorTextoTipoPaciente").val());
      
   })

   $("#colorFondoTipoPaciente").on("change", function() {
      //console.log($("#colorFondoTipoPaciente").val())
      $('#ejemploTipo').css('background-color',$("#colorFondoTipoPaciente").val());
      
   })

   $("#buscadorProductos").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tablaProductos tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $("#buscadorVentasPaciente").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tablaVentas tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $("#buscadorPresupuestosPaciente").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tablaPresupuestos tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $("#buscadorPedidosPaciente").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#tablaPedidos tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });

    $(".clickable-row").click(function() {
      
      let a = $(this).data("href");
      let url='/pacientes/paciente/'+a
      console.log(url)
      window.location = url;
  });


   $("#nombreProducto").on("change keypress input", function() {
      console.log(($("#nombreProducto").val()).length)
      let long=($("#nombreProducto").val()).length
      $("#spanNombreProducto").text( long+"/100"  );
   
   })

   $("#referenciaProducto").on("change keypress input", function() {
      let long=($("#referenciaProducto").val()).length
      $("#spanReferenciaProducto").text( long+"/30"  );
   
   })
   
   $("#descripcionProducto").on("change keypress input", function() {
      let long=($("#descripcionProducto").val()).length
      $("#spandescripcionProducto").text( long+"/500"  );
      
   })



   