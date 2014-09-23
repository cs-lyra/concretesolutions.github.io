$(document).ready(function(){
  $(".JS-depoimento").click(function(evento) {
    evento.preventDefault();
    $(".JS-depoimentoTexto").hide();
    div_id = $(this).attr("related-div");
    $(div_id).show();
  });
});
