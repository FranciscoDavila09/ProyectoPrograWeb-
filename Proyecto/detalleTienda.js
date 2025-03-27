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
      document.getElementById('producto-precio').textContent = `₡ ${producto.precioMax || producto.precio}`;

      // Si el producto tiene versiones, mostrarlas
      const versionContainer = document.getElementById('producto-versiones');
      if (producto.versiones && Array.isArray(producto.versiones)) {
        producto.versiones.forEach(version => {
          const btn = document.createElement('button');
          btn.className = 'btn btn-outline-dark me-2 mb-2';
          btn.textContent = `${version.nombre} (${version.precio} ₡)`;
          versionContainer.appendChild(btn);
        });
      }

    } else {
      document.body.innerHTML = "<h2 class='text-center mt-5'>Producto no encontrado</h2>";
    }
  })
  .catch(error => {
    console.error('Error cargando el producto:', error);
  });
