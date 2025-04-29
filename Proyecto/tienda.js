fetch('./JSON/tienda.json')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("contenedor-productos");

    data.tienda.forEach(producto => {
      const div = document.createElement("div");
      div.className = "col-md-4";
      div.innerHTML = `
        <div class="card mb-4 position-relative">
          ${producto.novedad ? '<span class="badge-nuevo">NOVEDAD</span>' : ''}
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.descripcion}">
          <div class="card-body">
            <h5 class="card-title">${producto.descripcion}</h5>
            <p class="card-text">PVP ${producto.precioMin} $ - PVP ${producto.precioMax} $</p>
            <a href="detalleTienda.html?id=${producto.id}" class="btn btn-link text-primary">Más info →</a>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando productos:", err));





// Esto es del carrito para ir a pago 

document.getElementById("btnIrPago").addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agrega productos antes de continuar con el pago.", "info");
    return;
  }

  // Redireccionar al formulario de pago
  window.location.href = "pago.html";
});









  /// Renderiza el carrito en la página de tienda.html

  function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito-contenido");
    const totalSpan = document.getElementById("carrito-total");
    contenedor.innerHTML = "";
    let total = 0;
  
    carrito.forEach(item => {
      const subtotal = item.precioMax * item.cantidad;
      total += subtotal;
  
      const div = document.createElement("div");
      div.className = "carrito-item";

  
      div.innerHTML = `
      <div class="d-flex">
        <img src="${item.imagen}" alt="${item.descripcion}">
        <div class="info">
          <p>${item.descripcion}</p>
          <small>${item.precioMax} $</small>
        </div>
      </div>
      <div class="acciones">
        <button class="eliminar-producto" data-id="${item.id}" title="Eliminar">
          🗑️
        </button>
        <select class="form-select form-select-sm w-auto" data-id="${item.id}">
          ${[...Array(10)].map((_, i) => `<option ${item.cantidad == i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
        </select>
      </div>
    `;
    
      contenedor.appendChild(div);
    });
  
    totalSpan.textContent = `${total.toFixed(2)} $`;
  
    // Cambio de cantidad
    contenedor.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", (e) => {
        const id = parseInt(e.target.dataset.id);
        const nuevaCantidad = parseInt(e.target.value);
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
        const index = carrito.findIndex(p => p.id === id);
        if (index !== -1) {
          carrito[index].cantidad = nuevaCantidad;
          localStorage.setItem("carrito", JSON.stringify(carrito));
          renderizarCarrito();
        }
      });
    });
  
    // Eliminar producto
    contenedor.querySelectorAll(".eliminar-producto").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
      });
    });
    actualizarResumenCarrito();
  }

  //Esto lo que hace es que actualiza el carrito en la barra de navegación


  function actualizarResumenCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + (item.precioMax * item.cantidad), 0);
    const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  
    document.getElementById('contador-carrito').textContent = cantidad;
    document.getElementById('total-carrito').textContent = `${total.toFixed(2)} $`;
  }

//Hacer clic en el ícono para abrir el carrito (Offcanvas)
  document.getElementById("icono-carrito").addEventListener("click", (e) => {
    e.preventDefault();
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
    offcanvas.show();
  });
  
  // Mostrar resumen al cargar
actualizarResumenCarrito();

// Mostrar contenido del carrito al cargar
renderizarCarrito();

// Clic en el ícono del carrito
document.getElementById("icono-carrito").addEventListener("click", (e) => {
  e.preventDefault();
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
  offcanvas.show();
});





/// En la parte del buscador de la tienda para que busque por nombre o descripción del producto

function buscarProducto(event) {
  event.preventDefault();

  const inputBusqueda = document.getElementById("busqueda-input").value.toLowerCase().trim();
  const tarjetas = document.querySelectorAll("#contenedor-productos .card");

  let encontrado = false;

  tarjetas.forEach(card => {
    const titulo = card.querySelector(".card-title").textContent.toLowerCase();
    if (titulo.includes(inputBusqueda)) {
      card.classList.add("border", "border-success", "border-3"); 
      encontrado = true;
    } else {
      card.classList.remove("border", "border-success", "border-3");
    }
  });

  if (!encontrado) {
    Swal.fire({
      icon: "warning",
      title: "Producto no encontrado",
      text: "No se encontraron coincidencias con tu búsqueda.",
    });
  }
}
