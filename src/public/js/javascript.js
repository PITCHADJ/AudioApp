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