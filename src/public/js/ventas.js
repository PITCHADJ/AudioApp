let productos=JSON.parse(products)
console.log(productos)
const listaProductos= document.querySelector("#product-list");
let precioSeleccionado=0
let tipoDescuento=1
let prueba=''

function loadData(data){
    if(data){
       
        let innerElement ="";
        
        data.forEach(item => {
            let precio= item.precioVenta.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
            /*innerElement += `
            <li onclick="selectPre(this)" value="${item.id}" precio="${item.precioVenta}">${item.nombre} -  ${precio}</li>`;*/
            innerElement += `
            <li onclick="selectEditPre(this)" value="${item.id}" precio="${item.precioVenta}">${item.nombre} -  ${precio}</li>`;            
        });
        return innerElement
    }

}

function filterData(data,searchText){
    return data.filter((x)=>x.nombre.toLowerCase().includes(searchText.toLowerCase()));
}



/*$('#buscadorProductosVenta').on("click",function() {
    let datoshtml=loadData(productos);
    $('#product-list').html(datoshtml[0]);
  });

  $('#buscadorProductosVenta').on("change keypress input",function() {
    let str=$("#buscadorProductosVenta").val();
    console.log (str)
    let a =filterData(productos,str)
    console.log(a)
    let datoshtml=loadData(a);
    $('#product-list').html(datoshtml[0]);
});*/

$( ".buscadorEditar #buscadorProductos" ).on( "click", function() {
    
    prueba=this
    let datoshtml=loadData(productos);
    $(this).parent().children("#product-list-edit").html(datoshtml)
    
 })

 $( ".buscadorEditar " ).on( "change keypress input", function() {
    let str=$(this).children('#buscadorProductos').val()
    let a =filterData(productos,str)
    let datoshtml=loadData(a);
    $(this).children('#product-list-edit').html(datoshtml)
    //console.log(str)
    
 })

function selectPre(e){
    $('#product-list').html("");
    
    precioSeleccionado=$(e).attr("precio")
    if(tipoDescuento==2){
        $('#descuento').attr('step', '0.01');
        $('#descuento').attr('max', precioSeleccionado);
    }else if (tipoDescuento==1){
        $('#descuento').attr('step', '1');
        $('#descuento').attr('max', '100');
    }
    $('#buscadorProductosVenta').val($(e).text());
    $('#productoSeleccionado').text($(e).val())
    $('#productoSeleccionado').val($(e).val())
}

function selectEditPre(e){
    console.log($(e))
    let a=($(e).parent().parent())
    precioSeleccionado=$(e).attr("precio")
    console.log(precioSeleccionado)
    //prueba=$(a).parent().parent().parent().children("#dp").children('#dataprecio')
    //console.log("tipo descuento: ",$(prueba).children('#tipoDesc').val())
    tipoDescuento=$(a).parent().parent().parent().children("#dp").children('#dataprecio').children('#tipoDesc').val()
    //console.log($(a).parent().parent().parent().children("#dp").children('#dataprecio'))
    $(a).parent().parent().parent().children("#dp").children('#dataprecio').data('precio',precioSeleccionado)
    
   //console.log($(prueba).data())
    let descuento=$(a).parent().parent().parent().children("#dp").children('#dataprecio').children('#descuento')
    
    if(tipoDescuento==2){
        $(descuento).attr('step', '0.01');
        $(descuento).attr('max', precioSeleccionado);
    }else if (tipoDescuento==1){
        $(descuento).attr('step', '1');
        $(descuento).attr('max', '100');
    }
    
    $(a).children('#buscadorProductos').val($(e).text())
    $(a).children('#productoSeleccionado').text($(e).val())
    $(a).children('#productoSeleccionado').val($(e).val())
    $(a).children('#product-list-edit').html("");
}

$('.tipoDesc #tipoDesc').on('change',function(){
    let a=$(this).val()
       
    precioSeleccionado=$(this).parent().data("precio")
       
    //console.log(precioSeleccionado)
    tipoDescuento=a
    let descuento=$(this).parent().children('#descuento')
    if( a == 1){
        $(descuento).attr('step', '1');
        $(descuento).attr('max', '100');
    }else if (a==2){
        $(descuento).attr('step', '0.01');
        $(descuento).attr('max', precioSeleccionado);
        //$('#descuento').removeAttr('max');

    }
    
    console.log(a)
})

$('#estadoVenta').on('change',function(){
    console.log($( "#estadoVenta option:selected" ).val())
    let url="http://localhost:3000/ventas/venta/updateEstimate/"+idpre+"/"+$( "#estadoVenta option:selected" ).val()
    console.log(url)
    $.ajax({
        type: "GET",
        url: url
       
      });
})

$('#npagos').on('change', function(){
    console.log($(this).val())
    let text=''
    $('#tiposPago').html($(text));
    let max=$(this).val()
    console.log(max)
    for(let i=0; i< max; i++){
        text+='<div class="row">'
        text+='<div class="col-md-6">'
        text+='<select class="form-select" name="metodopago">'
        tiposDePagoBlock.forEach(t =>{
           text+= `<option value="${t.id}">${t.nombre}</option>`

        })
        tiposDePagoUser.forEach(t =>{
            text+= `<option value="${t.id}">${t.nombre}</option>`
 
         })
        text+='</select>'
        text+='</div>'
        text+='<div class="col-md-6">'
        text+=`<input type="number" name="pago" class="form-control" value="0.00" step="0.01" min="0.00" required>`
        text+='</div>'
        text+='</div>'
        text+='<br>'
    }
    //console.log(text)

    $('#tiposPago').prepend($(text));
})