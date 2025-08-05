const habitaciones = {
  superior: { nombre: "Habitación Superior", precio: 120, descripcion: "Con vistas al mar y cama King Size." },
  familiar: { nombre: "Habitación Familiar", precio: 100, descripcion: "Ideal para familias con niños." },
  terraza: { nombre: "Habitación Terraza", precio: 130, descripcion: "Con terraza privada y jacuzzi." }
};

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

$(document).ready(function () {
  $('.ver-detalle').click(function () {
    const id = $(this).data('id');
    const hab = habitaciones[id];
    Swal.fire(hab.nombre, hab.descripcion, 'info');
  });

  $('.elegir-habitacion').click(function () {
    const id = $(this).data('id');
    carrito.push(habitaciones[id]);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    Swal.fire('Añadido', 'La habitación ha sido añadida al carrito.', 'success');
  });

  if ($('#lista-carrito').length > 0) {
    let total = 0;
    carrito.forEach(h => {
      $('#lista-carrito').append(`<li class="list-group-item">${h.nombre} - ${h.precio} €</li>`);
      total += h.precio;
    });
    $('#total').text(total);

    $('#reservar').click(function () {
      Swal.fire('¡Reservado!', 'Tu reserva ha sido realizada con éxito.', 'success');
      localStorage.removeItem('carrito');
    });
  }
});
