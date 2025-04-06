/*function iniciarMap(){
    var coord = {lat:9.9342274 ,lng: -84.3267663};
    var map = new google.maps.Map(document.getElementById('map'),{
      zoom: 10,
      center: coord
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map
    });
}
*/

// Inicializar EmailJS con tu ID
emailjs.init("0TqyeTQA2LyEaN0Sh"); 

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Calcular edad
    const fechaNacimiento = new Date(document.getElementById("fechaNacimiento").value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    // Obtener grados seleccionados
    const grados = Array.from(document.getElementById("grado").selectedOptions)
      .map(opt => opt.value)
      .join(", ");

    const templateParams = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
      edad: edad,
      rangoIngreso: document.getElementById("rangoIngreso").value,
      genero: document.getElementById("genero").value,
      grado: grados
    };

    emailjs.send("service_krgd5kg", "template_tyzycsr", templateParams)
      .then(function (response) {
        Swal.fire("¡Mensaje enviado!", "Te hemos contactado al correo ingresado.", "success");
        form.reset();
      }, function (error) {
        Swal.fire("Error", "Hubo un problema al enviar el mensaje. Intenta de nuevo.", "error");
        console.error("EmailJS error:", error);
      });
  });
});
