const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch('./JSON/detalle.json')
  .then(response => response.json())
  .then(data => {
    const producto = data.productos.find(p => p.id == id);

    if (producto) {
      document.getElementById('producto-imagen').src = producto.imagen;
      document.getElementById('producto-titulo').textContent = producto.descripcion;
      document.getElementById('producto-detalle').textContent = producto.detalle;
      document.getElementById('producto-precio-rango').textContent = `${producto.precioMin} € - ${producto.precioMax} €`;

      const versionesContainer = document.getElementById('producto-versiones');
      producto.versiones.forEach(version => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-dark me-2 mb-2';
        btn.textContent = `${version.nombre} (${version.precio} €)`;
        versionesContainer.appendChild(btn);
      });
    } else {
      document.body.innerHTML = "<h2 class='text-center mt-5'>Producto no encontrado</h2>";
    }
  })
  .catch(error => {
    console.error('Error cargando el producto:', error);
  });
