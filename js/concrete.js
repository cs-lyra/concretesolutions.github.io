/** Scroll opacity **/
$(document).ready(function() {
  $(".info").hide();
  $('#send').click(function(){
    //desabilitando o submit do form
    $("form").submit(function () { return false; });
    //atribuindo o valor do campo
    var sEmail  = $("#email").val();
    // filtros
    var emailFilter=/^.+@.+\..{2,}$/;
    var illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/
    // condição
    if(!(emailFilter.test(sEmail))||sEmail.match(illegalChars)){
      $(".info").show().removeClass("ok").addClass("erro")
      .text('Por favor, informe um email válido.');
    }else{
      $(".info").show().addClass("ok")
      .text('Email enviado com sucesso!');
    }
  });
  $('#email').focus(function(){
    $(".info.erro").hide();
  });

  // $('body').scrollspy({ target: '#secondary-menu' })

  // //scroll menusecondary
  // var nav = $('#secondary-menu');
  // $(window).scroll(function () { if ($(this).scrollTop() > 100) { nav.addClass("f-nav"); } else { nav.removeClass("f-nav"); } });

}); 



var divs = $('.hero-content, .hero-paragraph');
$(window).on('scroll', function() {
    var st = $(this).scrollTop();
    divs.css({ 
        'opacity' : 1 - st/450
    }); 
});