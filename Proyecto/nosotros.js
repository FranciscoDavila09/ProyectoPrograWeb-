// Agregar animaciones y efectos jQuery para la página Nosotros
$(document).ready(function () {

    // Fade in suave para cada .nosotros-item
    $('.nosotros-item').hide().each(function (i) {
      $(this).delay(i * 300).fadeIn(800);
    });
  
    // Hover animado con jQuery en vez de CSS puro
    $('.nosotros-item').hover(
      function () {
        $(this).find('img').stop().animate({
          width: '47%',
          opacity: 0.95
        }, 300);
        $(this).find('.nosotros-texto').stop().animate({
          paddingLeft: '20px'
        }, 300);
      },
      function () {
        $(this).find('img').stop().animate({
          width: '45%',
          opacity: 1
        }, 300);
        $(this).find('.nosotros-texto').stop().animate({
          paddingLeft: '0px'
        }, 300);
      }
    );
  
    // Botón de música con animación y estado
    let musicPlaying = false;
  
    $("#btnMusica").click(function () {
      const audio = $("#musicaFondo")[0];
      if (musicPlaying) {
        audio.pause();
        $(this).text("🎵 Activar música");
      } else {
        audio.play();
        $(this).text("⛔ Detener música");
      }
      musicPlaying = !musicPlaying;
    });
  
    // Efecto scroll con animación al hacer clic en enlaces
    $("a[href^='#']").on("click", function (e) {
      e.preventDefault();
      let target = $($(this).attr("href"));
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 800);
      }
    });
  });
  