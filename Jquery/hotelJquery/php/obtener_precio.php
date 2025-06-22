<?php
$conn = new mysqli('localhost', 'root', '', 'hotelJquery');

$id = $_GET['id'];
$fecha = $_GET['fecha'];
$dia = date('N', strtotime($fecha)); // 1 (lunes) a 7 (domingo)

if (in_array($dia, [5, 6, 7])) {
  $precio = 150; // viernes a domingo
} else {
  $precio = 120; // lunes a jueves
}

echo $precio;
?>
