const API = "http://localhost:3000/contactos";

// Cargar contactos al inicio
document.addEventListener("DOMContentLoaded", cargarContactos);

// FORMULARIO CREAR CONTACTO
document.getElementById("form-contacto").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    apellidos: apellidos.value,
    telefono: telefono.value,
    empresa: empresa.value,
    puesto: puesto.value,
    email: email.value,
    linkedin: linkedin.value,
  };

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    Swal.fire("¡Guardado!", "El contacto ha sido añadido", "success");
    e.target.reset();
    cargarContactos();
  });
});

// BUSCADOR EN TIEMPO REAL
document.getElementById("busqueda").addEventListener("input", () => {
  const filtro = document.getElementById("busqueda").value.toLowerCase();
  document.querySelectorAll("#tabla-contactos tr").forEach((tr) => {
    const texto = tr.textContent.toLowerCase();
    tr.style.display = texto.includes(filtro) ? "" : "none";
  });
});

// FUNCIONES PRINCIPALES
async function cargarContactos() {
  const res = await fetch(API);
  const data = await res.json();
  const tbody = document.getElementById("tabla-contactos");
  tbody.innerHTML = "";

  data.forEach((c) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.nombre} ${c.apellidos}</td>
        <td>${c.telefono}</td>
        <td>${c.empresa || "-"}</td>
        <td>${c.email || "-"}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="editar(${
            c.id
          })">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar(${
            c.id
          })">Borrar</button>
        </td>
      </tr>
    `;
  });
}

// ELIMINAR CONTACTO
function eliminar(id) {
  Swal.fire({
    title: "¿Seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API}/${id}`, { method: "DELETE" }).then(() => {
        Swal.fire("Eliminado", "Contacto eliminado", "success");
        cargarContactos();
      });
    }
  });
}

// EDITAR CONTACTO
async function editar(id) {
  // Obtener datos del contacto
  const res = await fetch(API);
  const contactos = await res.json();
  const c = contactos.find((x) => x.id === id);

  const { value: formValues } = await Swal.fire({
    title: "Editar contacto",
    html:
      `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${c.nombre}">` +
      `<input id="swal-apellidos" class="swal2-input" placeholder="Apellidos" value="${c.apellidos}">` +
      `<input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${c.telefono}">` +
      `<input id="swal-empresa" class="swal2-input" placeholder="Empresa" value="${
        c.empresa || ""
      }">` +
      `<input id="swal-puesto" class="swal2-input" placeholder="Puesto" value="${
        c.puesto || ""
      }">` +
      `<input id="swal-email" class="swal2-input" placeholder="Email" value="${
        c.email || ""
      }">` +
      `<input id="swal-linkedin" class="swal2-input" placeholder="LinkedIn" value="${
        c.linkedin || ""
      }">`,
    focusConfirm: false,
    preConfirm: () => {
      return {
        nombre: document.getElementById("swal-nombre").value,
        apellidos: document.getElementById("swal-apellidos").value,
        telefono: document.getElementById("swal-telefono").value,
        empresa: document.getElementById("swal-empresa").value,
        puesto: document.getElementById("swal-puesto").value,
        email: document.getElementById("swal-email").value,
        linkedin: document.getElementById("swal-linkedin").value,
      };
    },
  });

  if (formValues) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });
    Swal.fire("¡Actualizado!", "El contacto ha sido actualizado", "success");
    cargarContactos();
  }
}
