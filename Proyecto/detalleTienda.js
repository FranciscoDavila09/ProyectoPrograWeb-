// Obtener el ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Cargar los productos desde el JSON
fetch('./JSON/tienda.json')
  .then(response => response.json())
  .then(data => {
    // Buscar el producto con el ID indicado
    const producto = data.tienda.find(p => p.id == id);

    if (producto) {
      // Mostrar información del producto
      document.getElementById('producto-imagen').src = producto.imagen;
      document.getElementById('producto-imagen').alt = producto.descripcion;
      document.getElementById('producto-titulo').textContent = producto.descripcion;
      document.getElementById('producto-detalle').textContent = producto.detalle || "Sin detalle disponible.";
      document.getElementById('producto-precio-rango').textContent = `${producto.precioMin} - ${producto.precioMax}`;


      const botonCesta = document.querySelector(".btn.btn-primary");

botonCesta.addEventListener("click", () => {
  // Mostrar animación de carga
  const originalText = botonCesta.textContent;
  botonCesta.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Cargando...`;
  botonCesta.disabled = true;

  setTimeout(() => {
    agregarProductoAlCarrito(producto);
    botonCesta.innerHTML = originalText;
    botonCesta.disabled = false;

    // Mostrar carrito (Offcanvas)
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
    offcanvas.show();
  }, 1000);
});

   
      // SKU dinámico (puede ser ficticio)
      document.getElementById('producto-sku').textContent = `PROD${String(producto.id).padStart(4, '0')}`;

   // Mostrar versiones si hay
const versionContainer = document.getElementById('producto-versiones');
versionContainer.innerHTML = ''; // Limpiar primero
if (producto.versiones && Array.isArray(producto.versiones)) {
  producto.versiones.forEach(version => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-dark me-2 mb-2';
    btn.textContent = `${version.nombre} (${version.precio} €)`;
    versionContainer.appendChild(btn);
  });
} else {
  versionContainer.innerHTML = '<span class="text-muted">Única versión disponible</span>';
}
    }
  })
  .catch(error => {
    console.error('Error cargando el producto:', error);
  });



  function agregarProductoAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(p => p.id === producto.id);
  
    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
  
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarResumenCarrito();
  }
  
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
          <small>${item.precioMax} €</small>
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
  
    totalSpan.textContent = `${total.toFixed(2)} €`;
  
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
    document.getElementById('total-carrito').textContent = `${total.toFixed(2)} €`;
  }

//Hacer clic en el ícono para abrir el carrito (Offcanvas)
  document.getElementById("icono-carrito").addEventListener("click", (e) => {
    e.preventDefault();
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
    offcanvas.show();
  });


  // Botón "Realizar el pago"
const botonPagar = document.querySelector("#carritoOffcanvas .btn.btn-primary");
if (botonPagar) {
  botonPagar.addEventListener("click", () => {
    window.location.href = "pago.html";
  });
}

  
  // Mostrar resumen al cargar
actualizarResumenCarrito();

// Mostrar contenido del carrito al cargar
renderizarCarrito();
