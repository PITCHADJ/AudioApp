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