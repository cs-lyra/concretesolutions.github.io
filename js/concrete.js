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
    var illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/;
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

  // popover
  $('[data-toggle="popover"]').popover();

  $('body').on('click', function (e) {
      $('[data-toggle="popover"]').each(function () {
          //the 'is' for buttons that trigger popups
          //the 'has' for icons within a button that triggers a popup
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
              $(this).popover('hide');
          }
      });
  });

    
  //fitText
  // $(".text1").fitText(2.0);
  //  $(".text2").fitText(2.6);
});

var qs = (function(a) {
    if (a === "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

function openVaga(){
  if(qs["vaga"]){
      document.getElementById(qs["vaga"]).style.display = 'block';
  }
}

var divs = $('.hero-content, .hero-paragraph');
$(window).on('scroll', function() {
    var st = $(this).scrollTop();
    divs.css({
        'opacity' : 1 - st/450
    });
});