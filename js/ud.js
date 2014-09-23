$(document).ready(function(){
  $("#conteudo").load("descobrir.html");
  
  $(".JS-scrollMenu").click(function(evento){
    evento.preventDefault();
    var link = $(this).attr("href");
    var related_div = $(this).attr("related-div");
    $(".JS-banner").hide();
    $(related_div).show();
    
    $('#scrollingMenu li:first').animate({'opacity':0}, 0, function () {
      $(this).appendTo($('#scrollingMenu')).css('opacity', 1);
    });
    $('#scrollingMenu li').removeClass('active');
    $('#scrollingMenu li:nth-child(2)').addClass('active');
    $("#conteudo").load(link);
  });

  $(".JS-depoimento").click(function(evento) {
    evento.preventDefault();
    $(".JS-depoimentoTexto").hide();
    div_id = $(this).attr("related-div");
    $(div_id).show();
  });
});
