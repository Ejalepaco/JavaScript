// $(function () {
//   Swal.fire({
//     title: "SweetAlert is working!",
//     icon: "success",
//     draggable: true,
//   });
// });
// Selector para coger elemento en DOM $
// Llamar al selector, párrafo, h2, li, input
// Acción.

// $('p').hide(function () {});

// $("p:first").hide(); Esconde el primer párrafo

$("#miBoton").click(() => $("#parrafo1").toggle()); // Esconde con el click del button.

// $(".parrafo2").hide(); Con clases.
// $("#parrafo2").hide(); Con id.

// $("ul li:nth-child(3)").hide(); // Oculta el segundo li.

//Eventos jq.

$("ul li:nth-child(1)").click(function () {
  Swal.fire({
    title: "Función click works!",
    icon: "success",
    draggable: true,
  });
});

$("#btnLista").click(function () {
  Swal.fire({
    title: "Ocultando primer elemento de la lista",
  });
  $("ul li:first").hide();
});

$("#quitaypon").click(function () {
  Swal.fire({
    title: "Botón quita y pon 'toggle'",
  });
  $("ul li:first").toggle();
});
