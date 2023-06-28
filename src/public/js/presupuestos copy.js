let productos=JSON.parse(products)
console.log(productos)
const listaProductos= document.querySelector("#product-list");
let precioSeleccionado=0
let tipoDescuento=1

var prueba=''

function loadData(data){
    if(data){
       
        let innerElement ="";
        let datosEditar="";
        data.forEach(item => {
            let precio= item.precioVenta.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
            innerElement += `
            <li onclick="selectPre(this)" value="${item.id}" precio="${item.precioVenta}">${item.nombre} -  ${precio}</li>`;
            datosEditar += `
            <li onclick="selectEditPre(this)" value="${item.id}" precio="${item.precioVenta}">${item.nombre} -  ${precio}</li>`;            
        });
        return [innerElement,datosEditar]
    }

}

function filterData(data,searchText){
    return data.filter((x)=>x.nombre.toLowerCase().includes(searchText.toLowerCase()));
}

$( ".buscadorEditar #buscadorProductos" ).on( "click", function() {
    
    prueba=this
    let datoshtml=loadData(productos);
    $(this).parent().children("#product-list-edit").html(datoshtml[1])
    
 })

 $( ".buscadorEditar " ).on( "change keypress input", function() {
    let str=$(this).children('#buscadorProductos').val()
    let a =filterData(productos,str)
    let datoshtml=loadData(a);
    $(this).children('#product-list-edit').html(datoshtml[1])
    //console.log(str)
    
 })

$('#buscadorProductosPresupuesto').on("click",function() {
    let datoshtml=loadData(productos);
    $('#product-list').html(datoshtml[0]);
  });

  $('#buscadorProductosPresupuesto').on("change keypress input",function() {
    let str=$("#buscadorProductosPresupuesto").val();
    //console.log (str)
    let a =filterData(productos,str)
    //console.log(a)
    let datoshtml=loadData(a);
    $('#product-list').html(datoshtml[0]);
});


function selectPre(e){
    $('#product-list').html("");
    
    //console.log($(e).attr("precio"))
    precioSeleccionado=$(e).attr("precio")
    if(tipoDescuento==2){
        $('#descuento').attr('step', '0.01');
        $('#descuento').attr('max', precioSeleccionado);
    }else if (tipoDescuento==1){
        $('#descuento').attr('step', '1');
        $('#descuento').attr('max', '100');
    }
    $('#buscadorProductosPresupuesto').val($(e).text());
    $('#productoSeleccionado').text($(e).val())
    $('#productoSeleccionado').val($(e).val())
}
function selectEditPre(e){
    let a=($(e).parent().parent())
    
    console.log($(a).children('#product-list-edit'))
    
    precioSeleccionado=$(e).attr("precio")
    if(tipoDescuento==2){
        $('#descuento').attr('step', '0.01');
        $('#descuento').attr('max', precioSeleccionado);
    }else if (tipoDescuento==1){
        $('#descuento').attr('step', '1');
        $('#descuento').attr('max', '100');
    }
    
    $(a).children('#buscadorProductos').val($(e).text())
    $(a).children('#productoSeleccionado').text($(e).val())
    $(a).children('#productoSeleccionado').val($(e).val())
    $(a).children('#product-list-edit').html("");
}

$('.tipoDesc #tipoDesc').on('change',function(){
    let a=$(this).val()
    if(precioSeleccionado==0){
        precioSeleccionado=$(this).parent().data("precio")
    }
    
    console.log(precioSeleccionado)
    tipoDescuento=a
    if( a == 1){
        $('.tipoDesc #descuento').attr('step', '1');
        $('.tipoDesc #descuento').attr('max', '100');
    }else if (a==2){
        $('.tipoDesc #descuento').attr('step', '0.01');
        $('.tipoDesc #descuento').attr('max', precioSeleccionado);
        //$('#descuento').removeAttr('max');

    }
    
    console.log(a)
})


/*$('#tipoDesc').on('change',function(){
    
    let a =$( "#tipoDesc option:selected" ).val();
    tipoDescuento=a
    if( a == 1){
        $('#descuento').attr('step', '1');
        $('#descuento').attr('max', '100');
    }else if (a==2){
        $('#descuento').attr('step', '0.01');
        $('#descuento').attr('max', precioSeleccionado);
        //$('#descuento').removeAttr('max');

    }
    
    console.log(a)
})*/

$('#estadoPresupuesto').on('change',function(){
    console.log($( "#estadoPresupuesto option:selected" ).val())
    let url="http://localhost:3000/presupuestos/presupuesto/updateEstimate/"+idpre+"/"+$( "#estadoPresupuesto option:selected" ).val()
    console.log(url)
    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        success: function(data){
            window.location = data;
         }
         , error: function(jqXHR, textStatus, err){
             alert('text status '+textStatus+', err '+err)
         }
         
       
      });
})