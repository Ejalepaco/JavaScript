$(document).ready(function () {
  let carrito = [];
  let total = 0;

  function actualizarCarrito() {
    const $carrito = $("#carrito");
    $carrito.empty();
    total = 0;

    carrito.forEach((item, i) => {
      $carrito.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${item.nombre} - ${item.precio} €
          <button class="btn btn-sm btn-danger eliminar" data-index="${i}">&times;</button>
        </li>
      `);
      total += item.precio;
    });

    $("#total").text(total.toFixed(2));
  }

  // Cargar habitaciones desde carpeta php/
  $.getJSON("php/habitaciones.php", function (data) {
    data.forEach((h) => {
      $("#habitaciones-container").append(`
        <div class="col-md-6 mb-3">
          <div class="card habitacion" data-id="${h.id}" data-nombre="${h.nombre}">
            <div class="card-body">
              <h5 class="card-title">${h.nombre}</h5>
              <p class="card-text">Selecciona una fecha para ver el precio</p>
              <button class="btn btn-primary agregar">Agregar a la reserva</button>
            </div>
          </div>
        </div>
      `);
    });
  });

  $(".nav-btn").click(function () {
    const section = $(this).data("section");
    $(".content-section").hide();
    $("#" + section).fadeIn();
  });

  $(document).on("click", ".agregar", function () {
    const $card = $(this).closest(".habitacion");
    const id = $card.data("id");
    const nombre = $card.data("nombre");
    const fecha = $("#fecha").val();

    if (!fecha) {
      Swal.fire("Selecciona una fecha", "", "warning");
      return;
    }

    $.get(`php/obtener_precio.php?id=${id}&fecha=${fecha}`, function (precio) {
      carrito.push({ nombre, precio: parseFloat(precio) });
      actualizarCarrito();
      Swal.fire("Agregado", nombre + " añadida a tu reserva.", "success");
    });
  });

  $(document).on("click", ".eliminar", function () {
    const index = $(this).data("index");
    carrito.splice(index, 1);
    actualizarCarrito();
  });

  $("#vaciar-carrito").click(function () {
    carrito = [];
    actualizarCarrito();
  });

  $("#form-reserva").submit(function (e) {
    e.preventDefault();
    const nombre = $("#nombre").val();
    const email = $("#email").val();

    if (carrito.length === 0) {
      Swal.fire("Tu carrito está vacío", "", "info");
      return;
    }

    $.post(
      "php/confirmar_reserva.php",
      {
        nombre,
        email,
        habitaciones: JSON.stringify(carrito),
        total,
      },
      function (res) {
        Swal.fire("¡Reserva confirmada!", res, "success");
        carrito = [];
        actualizarCarrito();
        $("#form-reserva")[0].reset();
      }
    );
  });
});
