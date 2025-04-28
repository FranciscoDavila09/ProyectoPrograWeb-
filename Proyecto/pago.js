











const contenedorResumen = document.getElementById("resumen-producto");
const botonPagar = document.getElementById("btn-pagar");
const formPago = document.getElementById("form-pago");
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let total = 0;
let html = "";

carrito.forEach(item => {
  const subtotal = item.precioMax * item.cantidad;
  total += subtotal;

  html += `
    <div class="producto-item d-flex align-items-center mb-3 bg-light p-2 rounded">
      <img src="${item.imagen}" alt="${item.descripcion}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 5px; margin-right: 10px;">
      <div>
        <h6>${item.descripcion}</h6>
        <p class="mb-0"><strong>Precio:</strong> ${item.precioMax} $</p>
        <p class="mb-0"><strong>Cantidad:</strong> ${item.cantidad}</p>
        <p class="mb-0"><strong>Subtotal:</strong> ${subtotal.toFixed(2)} $</p>
      </div>
    </div>
  `;
});

html += `<div class="total-pago mt-3 text-end fw-bold fs-5">Total: ${total.toFixed(2)} $</div>`;
contenedorResumen.innerHTML = html;
botonPagar.innerText = `Pagar ${total.toFixed(2)} $`;


// Evento al enviar el formulario de pago
formPago.addEventListener("submit", (e) => {
  e.preventDefault();



// Verificar si el usuario está logueado
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

if (!usuarioActual) {
  Swal.fire({
    icon: 'info',
    title: 'Inicio de sesión requerido',
    text: 'Debes iniciar sesión o registrarte para realizar el pago.',
    confirmButtonText: 'Aceptar'
  }).then(() => {
    window.location.href = "index.html"; 
  });
  return; 
}



  // Verificar si el carrito tiene productos
  const carritoActualizado = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carritoActualizado.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Tu carrito está vacío. Agrega productos antes de pagar.',
      confirmButtonText: 'Aceptar'
    });
    return;
  }


// Validar campos del formulario





  const campos = ["numeroTarjeta", "cvc", "expiracion", "nombreTarjeta"];
  let camposValidos = true;

  for (const id of campos) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
      campo.classList.add("is-invalid");
      campo.classList.remove("is-valid");
      camposValidos = false;
    } else {
      campo.classList.remove("is-invalid");
      campo.classList.add("is-valid");
    }
  }
  
  if (!camposValidos) {
    Swal.fire("Faltan campos", "Por favor, complete todos los datos del formulario.", "warning");
    return;
  }
  

  const tarjeta = document.getElementById("numeroTarjeta").value.trim();
  const cvc = document.getElementById("cvc").value.trim();
  const expiracion = document.getElementById("expiracion").value.trim();
  const regexTarjeta = /^\d{4} \d{4} \d{4} \d{4}$/;
  const regexCVC = /^\d{3,4}$/;

  if (!regexTarjeta.test(tarjeta)) {
    Swal.fire("Número inválido", "El número de tarjeta debe tener 16 dígitos separados por espacios.", "error");
    return;
  }

  if (!regexCVC.test(cvc)) {
    Swal.fire("CVC inválido", "El CVC debe ser de 3 o 4 dígitos numéricos.", "error");
    return;
  }


  const [mes, año] = expiracion.split('/').map(part => parseInt(part));
  const añoActual = new Date().getFullYear() % 100;

  if (año < 25) {
    Swal.fire("Fecha inválida", "La tarjeta debe expirar en el año 2025 o posterior.", "error");
    return;
  }

  if (mes < 1 || mes > 12) {
    Swal.fire("Fecha inválida", "El mes de expiración debe ser entre 01 y 12.", "error");
    return;
  }




  //  Mostrar mensaje de pago exitoso
  Swal.fire({
    icon: 'success',
    title: 'Pago exitoso',
    text: 'Su pago fue procesado correctamente.',
    showConfirmButton: false,
    timer: 2500
  }).then(() => {
    //  Limpiar carrito y cerrar sesión
    localStorage.removeItem("carrito");
    localStorage.removeItem("usuarioActual");
    formPago.reset();
    contenedorResumen.innerHTML = "";
    botonPagar.innerText = "Pagar";




    // Limpiar clases de validación después del pago
document.querySelectorAll("#form-pago input, #form-pago select").forEach(campo => {
  campo.classList.remove("is-valid", "is-invalid");
});

  });
});

// Validación visual en tiempo real
document.querySelectorAll("#form-pago input, #form-pago select").forEach(campo => {
  campo.addEventListener("input", () => {
    if (campo.checkValidity()) {
      campo.classList.remove("is-invalid");
      campo.classList.add("is-valid");
    } else {
      campo.classList.remove("is-valid");
      campo.classList.add("is-invalid");
    }
  });
});



//Máscara automática para el número de tarjeta agrupa en bloques de 4
document.getElementById('numeroTarjeta').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); 
  value = value.substring(0, 16); 
  value = value.replace(/(\d{4})(?=\d)/g, '$1 '); 
  e.target.value = value;
});