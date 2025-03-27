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
            <p class="card-text">PVP ${producto.precioMin} € - PVP ${producto.precioMax} €</p>
            <a href="detalleTienda.html?id=${producto.id}" class="btn btn-link text-primary">Más info →</a>
          </div>
        </div>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando productos:", err));
