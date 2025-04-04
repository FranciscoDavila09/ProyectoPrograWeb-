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
        <p class="mb-0"><strong>Precio:</strong> ${item.precioMax} €</p>
        <p class="mb-0"><strong>Cantidad:</strong> ${item.cantidad}</p>
        <p class="mb-0"><strong>Subtotal:</strong> ${subtotal.toFixed(2)} €</p>
      </div>
    </div>
  `;
});

html += `<div class="total-pago mt-3 text-end fw-bold fs-5">Total: ${total.toFixed(2)} €</div>`;
contenedorResumen.innerHTML = html;
botonPagar.innerText = `Pagar ${total.toFixed(2)} €`;


// Evento al enviar el formulario de pago
formPago.addEventListener("submit", (e) => {
  e.preventDefault();

  const campos = ["numeroTarjeta", "cvc", "expiracion", "nombreTarjeta"];
  for (const id of campos) {
    if (!document.getElementById(id).value.trim()) {
      Swal.fire("Faltan campos", "Por favor, complete todos los datos del formulario.", "warning");
      return;
    }
  }

  const tarjeta = document.getElementById("numeroTarjeta").value.trim();
  const cvc = document.getElementById("cvc").value.trim();
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

  //  Mostrar mensaje de pago exitoso
  Swal.fire({
    icon: 'success',
    title: 'Pago exitoso',
    text: 'Su pago fue procesado correctamente.',
    showConfirmButton: false,
    timer: 2500
  }).then(() => {
    localStorage.removeItem("carrito");
    formPago.reset();
    contenedorResumen.innerHTML = "";
    botonPagar.innerText = "Pagar";
  });
});