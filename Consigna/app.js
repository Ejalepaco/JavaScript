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
    const hoy = new Date().setHours(0, 0, 0, 0); // Solo fecha

    let reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    reservas = reservas.filter(
      (r) => new Date(r.fecha).setHours(0, 0, 0, 0) >= hoy
    );

    localStorage.setItem("reservas", JSON.stringify(reservas));

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

  // Exportar a Excel (.xlsx)
  document
    .getElementById("exportarExcel")
    .addEventListener("click", exportarTabla);

  function exportarTabla() {
    const hoy = new Date().setHours(0, 0, 0, 0);
    const reservas = JSON.parse(
      localStorage.getItem("reservas") || "[]"
    ).filter((r) => new Date(r.fecha).setHours(0, 0, 0, 0) >= hoy);

    if (reservas.length === 0) {
      Swal.fire("Sin datos", "No hay reservas futuras para exportar.", "info");
      return;
    }

    const datos = reservas.map((r) => ({
      Localizador: r.localizador,
      Identificador: r.identificador,
      Nombre: r.nombre,
      Fecha: r.fecha,
      "Nº Maletas": r.numMaletas,
      Ubicación: r.ubicacion,
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");

    XLSX.writeFile(workbook, "reservas_futuras.xlsx");
  }

  mostrarReservas(); // Mostrar reservas al cargar
});
