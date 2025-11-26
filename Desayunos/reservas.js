let reservas = [];
let editIndex = null;

const form = document.getElementById("reservaForm");
const tablaBody = document.querySelector("#tablaReservas tbody");
const btnCancelar = document.getElementById("btnCancelar");
const btnSubmit = document.getElementById("btnSubmit");
const fechaFiltroInput = document.getElementById("fechaFiltro");
const btnImprimir = document.getElementById("btnImprimir");

// ===== CARGAR / GUARDAR =====
function cargarReservas() {
  const datos = localStorage.getItem("reservas");
  reservas = datos ? JSON.parse(datos) : [];
  mostrarTabla();
}

function guardarReservas() {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

// ===== TABLA =====
function agregarFila(reserva, i) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${reserva.franja}</td>
    <td>${reserva.habitacion}</td>
    <td>${reserva.fecha}</td>
    <td>${reserva.noches}</td>
    <td>${reserva.personas}</td>
    <td>${reserva.observaciones || ""}</td>
    <td class="acciones">
      <button class="btn btn-sm btn-warning me-1" onclick="editarReserva(${i})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${i})">Eliminar</button>
    </td>
  `;
  tablaBody.appendChild(fila);
}

function mostrarTabla() {
  const fechaFiltro = fechaFiltroInput.value;
  tablaBody.innerHTML = "";

  reservas.sort((a, b) => a.franja.localeCompare(b.franja));

  if (!fechaFiltro) {
    reservas.forEach((reserva, i) => agregarFila(reserva, i));
    return;
  }

  // Fecha del filtro como local
  const filtroDate = new Date(fechaFiltro + "T00:00");

  reservas.forEach((reserva, i) => {
    // Fecha de entrada como local
    const entrada = new Date(reserva.fecha + "T00:00");

    // Primer día de desayuno
    const desayunoDesde = new Date(entrada);
    desayunoDesde.setDate(desayunoDesde.getDate() + 1);

    // Último día de desayuno
    const desayunoHasta = new Date(entrada);
    desayunoHasta.setDate(desayunoHasta.getDate() + reserva.noches);

    // Ajuste de horas a 0 para comparación
    desayunoDesde.setHours(0,0,0,0);
    desayunoHasta.setHours(0,0,0,0);

    // Filtrar por rango de desayuno
    if (filtroDate >= desayunoDesde && filtroDate <= desayunoHasta) {
      agregarFila(reserva, i);
    }
  });
}

// ===== FORMULARIO =====
window.addEventListener("DOMContentLoaded", () => {
  const inputFecha = document.getElementById("fecha");
  const hoy = new Date().toISOString().split("T")[0];
  inputFecha.value = hoy;
});

function limpiarFormulario() {
  const fechaActual = form.fecha.value;
  const nochesActuales = form.noches.value;
  const personasActuales = form.personas.value;

  form.reset();

  form.fecha.value = fechaActual;
  form.noches.value = nochesActuales;
  form.personas.value = personasActuales;

  editIndex = null;
  btnSubmit.textContent = "Guardar";
  btnCancelar.classList.add("d-none");
}

function editarReserva(i) {
  const reserva = reservas[i];

  document.getElementById("habitacion").value = reserva.habitacion;
  document.getElementById("fecha").value = reserva.fecha;
  document.getElementById("noches").value = reserva.noches;
  document.getElementById("personas").value = reserva.personas;
  document.getElementById("franja").value = reserva.franja;
  document.getElementById("observaciones").value = reserva.observaciones || "";

  editIndex = i;
  btnSubmit.textContent = "Actualizar reserva";
  btnCancelar.classList.remove("d-none");
}

function eliminarReserva(i) {
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      reservas.splice(i, 1);
      guardarReservas();
      mostrarTabla();
      Swal.fire("Eliminada!", "La reserva ha sido eliminada.", "success");

      if (editIndex === i) {
        limpiarFormulario();
      }
    }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaReserva = {
    habitacion: form.habitacion.value,
    fecha: form.fecha.value,
    noches: parseInt(form.noches.value, 10),
    personas: parseInt(form.personas.value, 10),
    franja: form.franja.value,
    observaciones: form.observaciones.value.trim(),
    fechaRegistro:
      editIndex !== null
        ? reservas[editIndex].fechaRegistro
        : new Date().toISOString(),
  };

  if (editIndex !== null) {
    reservas[editIndex] = nuevaReserva;
    Swal.fire("Actualizado!", "La reserva ha sido actualizada.", "success");
  } else {
    reservas.push(nuevaReserva);
    Swal.fire("Confirmada", "La reserva ha sido añadida.", "success");
  }

  guardarReservas();
  mostrarTabla();
  limpiarFormulario();
});

btnCancelar.addEventListener("click", limpiarFormulario);
fechaFiltroInput.addEventListener("change", mostrarTabla);

// ===== IMPRIMIR =====
btnImprimir.addEventListener("click", () => {
  const contenidoTabla = document.getElementById("tablaReservas").outerHTML;
  const ventanaImprimir = window.open("", "", "width=800,height=600");

  ventanaImprimir.document.write(`
    <html>
      <head>
        <title>Listado de Reservas</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
          @media print {
            .acciones,
            th.acciones {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <h3 class="container m-5">Listado de Reservas</h3>
        ${contenidoTabla}
      </body>
    </html>
  `);

  ventanaImprimir.document.close();
  ventanaImprimir.focus();
  ventanaImprimir.print();
  ventanaImprimir.close();
});

// Exponer funciones globales
window.editarReserva = editarReserva;
window.eliminarReserva = eliminarReserva;

// Cargar reservas al inicio
cargarReservas();
