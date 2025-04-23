document.addEventListener("DOMContentLoaded", function () {
    fetch("./JSON/detalle.json")

        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Productos cargados correctamente:", data);
            mostrarProductos(data.productos);
        })
        .catch(error => console.error("Error al cargar los productos:", error));
});

function mostrarProductos(productos) {
    let contenedor = document.getElementById("productos-container");

    if (!contenedor) {
        console.error("Error: No se encontró el contenedor de productos.");
        return;
    }

    productos.forEach(producto => {
        let card = document.createElement("div");
        card.className = "col-md-3";
        card.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.descripcion}">
                <div class="card-body text-center">
                    <h5 class="card-title">${producto.descripcion}</h5>
                    <p class="text-danger">${producto.precio} $</p>
                    <button class="btn btn-primary ver-producto" data-id="${producto.id}">Ver Producto</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    document.querySelectorAll(".ver-producto").forEach(button => {
        button.addEventListener("click", function () {
            let productId = this.getAttribute("data-id");
            console.log("Producto seleccionado:", productId);
            window.location.href = `detalleProducto.html?id=${productId}`;
        });
    });
}
