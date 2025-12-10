let reservas = [];
let editIndex = null;

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservaForm");
  const tablaBody = document.querySelector("#tablaReservas tbody");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnSubmit = document.getElementById("btnSubmit");
  const fechaFiltroInput = document.getElementById("fechaFiltro");
  const selectHabitacion = document.getElementById("habitacion");
  const btnImprimir = document.getElementById("btnImprimir");

  // Generar habitaciones
  for (let piso = 1; piso <= 6; piso++) {
    for (let num = 1; num <= 12; num++) {
      const habitacion = `${piso}0${num}`;
      const opt = document.createElement("option");
      opt.value = habitacion;
      opt.textContent = habitacion;
      selectHabitacion.appendChild(opt);
    }
  }

  // Fecha hoy por defecto
  document.getElementById("fecha").value = new Date()
    .toISOString()
    .split("T")[0];

  function guardarReservas() {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }

  function cargarReservas() {
    const datos = localStorage.getItem("reservas");
    reservas = datos ? JSON.parse(datos) : [];
    mostrarTabla();
  }

  function agregarFila(reserva) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reserva.franja}</td>
      <td>${reserva.habitacion}</td>
      <td>${reserva.diaDesayuno}</td>
      <td>${reserva.personas}</td>
      <td>${reserva.observaciones || ""}</td>
      <td class="acciones">
        <button class="btn btn-warning btn-sm" data-action="edit" data-index="${
          reserva.originalIndex
        }">Editar</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-index="${
          reserva.originalIndex
        }">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  }

  function sumarDias(fechaStr, dias) {
    const [y, m, d] = fechaStr.split("-").map(Number);
    const date = new Date(y, m - 1, d + dias);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function mostrarTabla() {
    const fechaFiltro = fechaFiltroInput.value;
    tablaBody.innerHTML = "";

    const filas = [];

    reservas.forEach((reserva, i) => {
      for (let d = 1; d <= reserva.noches; d++) {
        const diaDesayuno = sumarDias(reserva.fecha, d);
        if (fechaFiltro && diaDesayuno !== fechaFiltro) continue;

        filas.push({
          ...reserva,
          diaDesayuno,
          originalIndex: i,
        });
      }
    });

    // Ordenar por franja horaria (hora)
    filas.sort((a, b) => a.franja.localeCompare(b.franja));

    filas.forEach((reserva) => agregarFila(reserva));
  }

  function limpiarFormularioParcial() {
    // Solo limpiar habitación, franja y observaciones
    form.habitacion.value = "";
    form.franja.value = "";
    form.observaciones.value = "";
    editIndex = null;
    btnSubmit.textContent = "Guardar";
  }

  function cargarEnFormulario(i) {
    const r = reservas[i];
    form.habitacion.value = r.habitacion;
    form.fecha.value = r.fecha;
    form.noches.value = r.noches;
    form.personas.value = r.personas;
    form.franja.value = r.franja;
    form.observaciones.value = r.observaciones;
    editIndex = i;
    btnSubmit.textContent = "Actualizar";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevaReserva = {
      habitacion: form.habitacion.value,
      fecha: form.fecha.value,
      noches: parseInt(form.noches.value),
      personas: parseInt(form.personas.value),
      franja: form.franja.value,
      observaciones: form.observaciones.value,
    };
    if (editIndex !== null) {
      reservas[editIndex] = nuevaReserva;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Reserva actualizada",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      reservas.push(nuevaReserva);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Reserva guardada",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    guardarReservas();
    mostrarTabla();
    limpiarFormularioParcial();
  });

  btnCancelar.addEventListener("click", () => {
    limpiarFormularioParcial();
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Formulario cancelado",
      showConfirmButton: false,
      timer: 1200,
    });
  });

  tablaBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (btn.dataset.action === "edit") {
      cargarEnFormulario(index);
    } else if (btn.dataset.action === "delete") {
      Swal.fire({
        title: "¿Eliminar reserva?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
      }).then((result) => {
        if (result.isConfirmed) {
          reservas.splice(index, 1);
          guardarReservas();
          mostrarTabla();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Reserva eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  });

  fechaFiltroInput.addEventListener("change", mostrarTabla);

  btnImprimir.addEventListener("click", () => {
    const contenidoTabla = document.getElementById("tablaReservas").outerHTML;
    const ventana = window.open("", "", "width=900,height=700");
    ventana.document.write(`
      <html>
        <head>
          <title>Listado de Reservas</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
          <style>
            @media print { .acciones, th.acciones { display: none !important; } }
            body { padding: 20px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h3>Listado de Reservas</h3>
          ${contenidoTabla}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  });

  cargarReservas();
});
