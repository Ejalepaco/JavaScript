let nombreInput = document.querySelector("#nombreInput");
let descripcionInput = document.querySelector("#descripcionInput");
let areaInput = document.querySelector("#areaInput");
let btnGuardar = document.querySelector("#btnGuardar");
let divResultados = document.querySelector("div.row.g-4"); // creación del nodo que se muestra.

btnGuardar.addEventListener("click", (e) => {
  let nombre = nombreInput.value;
  let descripcion = descripcionInput.value;
  let area = areaInput.value;
  if (nombre.length > 0 && descripcion.length > 0 && area.length > 0) {
    Swal.fire("Tarea añadida");
    agregarTarea(nombre, descripcion, area);
    limpiarDatos();
  } else {
    Swal.fire({
      icon: "error",
      text: "Faltan datos",
    });
  }
});

function agregarTarea(nombre, descripcion, area) {
  let columna = document.createElement("div");
  columna.className = "col";

  let carta = document.createElement("div");
  carta.className = "card";

  let imagen = document.createElement("img");
  imagen.className = "card-img-top";

  let textoArea = ""; // ← Para mostrar el nombre del área

  if (area == 1 || area === 1) {
    imagen.src = "https://cdn-icons-png.flaticon.com/512/3667/3667919.png";
    textoArea = "Backend";
  } else if (area == 2) {
    imagen.src = "https://cdn-icons-png.flaticon.com/512/8099/8099466.png";
    textoArea = "FrontEnd";
  } else {
    imagen.src = "https://cdn-icons-png.flaticon.com/512/5538/5538513.png";
    textoArea = "Marketing";
  }

  let bodyCard = document.createElement("div");
  bodyCard.className = "card-body";

  let titulo = document.createElement("h3");
  titulo.innerText = nombre;

  let descripcionTexto = document.createElement("p");
  descripcionTexto.innerText = descripcion;

  let areaTexto = document.createElement("p");
  areaTexto.innerText = "Área: " + textoArea;

  bodyCard.append(titulo);
  bodyCard.append(descripcionTexto);
  bodyCard.append(areaTexto); // ← Añadido a la tarjeta

  carta.append(imagen);
  carta.append(bodyCard);
  columna.append(carta);

  divResultados.append(columna);
}

function limpiarDatos() {
  nombreInput.value = "";
  descripcionInput.value = "";
  areaInput.value = "";
}
