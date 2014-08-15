$(document).ready(function(){
  $("#conteudo").load("descobrir.html");
  $("#btn-descobrir").click(function(evento){
    evento.preventDefault();
    $("#conteudo").load("descobrir.html");
  });

  $("#btn-desenvolver").click(function(evento){
    evento.preventDefault();
    $("#conteudo").load("desenvolver.html");
  });

  $("#btn-gerenciar").click(function(evento){
    evento.preventDefault();
    $("#conteudo").load("gerenciar.html");
  });
});

// script ocultar e exebir
//declaração do Array, com tamanho 5(elementos)
arDivs = new Array(4);

arDivs[0] = "div1";
arDivs[1] = "div2";
arDivs[2] = "div3";
arDivs[3] = "div4";

function ExibirOcultarDivs(id) {
   var div;
   for (var i = 0; i < 5; i++) {
       div = document.getElementById(arDivs[i]);
       if (div.id == id) {
           div.style.display = 'block';
       }
       else {
           div.style.display = 'none';
       }
   }
}

$(function(){
	$("#carrossel").jCarouselLite({
			btnPrev : '.prev',
			btnNext : '.next',
			auto    : 4000,
			speed   : 3000,
			visible : 4
	});
});
