document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("equipajeForm");
  const tabla = document.querySelector("#tablaReservas tbody");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const reserva = {
      localizador: document.getElementById("localizador").value,
      identificador: parseInt(document.getElementById("identificador").value),
      nombre: document.getElementById("nombre").value,
      fecha: document.getElementById("fecha").value,
      numMaletas: parseInt(document.getElementById("numMaletas").value),
      ubicacion: document.getElementById("ubicacion").value,
      consentimiento: document.getElementById("consentimiento").checked,
    };

    if (!reserva.consentimiento) {
      Swal.fire("Error", "Debes aceptar el consentimiento.", "error");
      return;
    }

    guardarReserva(reserva);
    form.reset();
    Swal.fire("Guardado", "Reserva añadida correctamente", "success");
    mostrarReservas();
  });

  function guardarReserva(reserva) {
    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  function mostrarReservas() {
    const hoy = new Date().setHours(0, 0, 0, 0); // Solo fecha, sin hora

    // Cargar y filtrar
    let reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    reservas = reservas.filter(
      (r) => new Date(r.fecha).setHours(0, 0, 0, 0) >= hoy
    );

    // Guardar solo futuras
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Ordenar y mostrar
    reservas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    tabla.innerHTML = "";

    for (let r of reservas) {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${r.localizador}</td>
      <td>${r.identificador}</td>
      <td>${r.nombre}</td>
      <td>${r.fecha}</td>
      <td>${r.numMaletas}</td>
      <td>${r.ubicacion}</td>
    `;
      tabla.appendChild(row);
    }
  }

  mostrarReservas(); // Mostrar al cargar
});
