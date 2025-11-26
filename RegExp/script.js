// Validar Email
function validarEmail() {
  const email = document.getElementById("email").value;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  const resultado = regexEmail.test(email)
    ? `✅ "${email}" es un email válido.`
    : `❌ "${email}" no es un email válido.`;
  document.getElementById("resultadoEmail").innerText = resultado;
}

// Validar Teléfono español
function validarTelefono() {
  const telefono = document.getElementById("telefono").value;
  const regexTelefono = /^[6|7|9]\d{8}$/;
  const resultado = regexTelefono.test(telefono)
    ? `✅ "${telefono}" es un teléfono válido.`
    : `❌ "${telefono}" no es un teléfono válido.`;
  document.getElementById("resultadoTelefono").innerText = resultado;
}

// Buscar palabra en texto
function buscarPalabra() {
  const texto = document.getElementById("texto").value;
  const palabra = document.getElementById("palabra").value;
  if (!palabra) {
    document.getElementById("resultadoBusqueda").innerText =
      "Introduce una palabra a buscar.";
    return;
  }
  const regex = new RegExp(`\\b${palabra}\\b`, "gi"); // búsqueda global e insensible a mayúsculas
  const coincidencias = texto.match(regex);
  const resultado = coincidencias
    ? `✅ Se encontró la palabra "${palabra}" ${coincidencias.length} veces.`
    : `❌ No se encontró la palabra "${palabra}".`;
  document.getElementById("resultadoBusqueda").innerText = resultado;
}
