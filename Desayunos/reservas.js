let reservas = [];
let editIndex = null;

const form = document.getElementById("reservaForm");
const tablaBody = document.querySelector("#tablaReservas tbody");
const btnCancelar = document.getElementById("btnCancelar");
const btnSubmit = document.getElementById("btnSubmit");
const fechaFiltroInput = document.getElementById("fechaFiltro");
const btnImprimir = document.getElementById("btnImprimir");

function cargarReservas() {
  const datos = localStorage.getItem("reservas");
  reservas = datos ? JSON.parse(datos) : [];
  mostrarTabla();
}

function guardarReservas() {
  localStorage.setItem("reservas", JSON.stringify(reservas));
}

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

  const filtroDate = new Date(fechaFiltro);
  filtroDate.setHours(0, 0, 0, 0);

  reservas.forEach((reserva, i) => {
    const entrada = new Date(reserva.fecha);
    entrada.setHours(0, 0, 0, 0);

    const salida = new Date(entrada);
    salida.setDate(entrada.getDate() + reserva.noches - 1);
    salida.setHours(0, 0, 0, 0);

    const inicioServicio = new Date(entrada);
    inicioServicio.setDate(entrada.getDate() + 1);
    inicioServicio.setHours(0, 0, 0, 0);

    if (filtroDate >= inicioServicio && filtroDate <= salida) {
      agregarFila(reserva, i);
    }
  });
}
window.addEventListener("DOMContentLoaded", () => {
  const inputFecha = document.getElementById("fecha");
  const hoy = new Date().toISOString().split("T")[0];
  inputFecha.value = hoy;
});
function limpiarFormulario() {
  form.reset();
  editIndex = null;
  btnSubmit.textContent = "Enviar reserva";
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
    // text: "¡Recuerda !",
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

cargarReservas();

window.editarReserva = editarReserva;
window.eliminarReserva = eliminarReserva;
