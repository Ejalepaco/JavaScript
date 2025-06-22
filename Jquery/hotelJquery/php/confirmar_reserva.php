<?php
$conn = new mysqli('localhost', 'root', '', 'hotelJquery');

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$habitaciones = json_decode($_POST['habitaciones'], true);
$total = $_POST['total'];

$conn->query("INSERT INTO reservas (nombre, email, total) VALUES ('$nombre', '$email', $total)");
$reserva_id = $conn->insert_id;

foreach ($habitaciones as $h) {
  $nombre_hab = $conn->real_escape_string($h['nombre']);
  $precio = floatval($h['precio']);
  $conn->query("INSERT INTO reserva_detalle (reserva_id, nombre_habitacion, precio) VALUES ($reserva_id, '$nombre_hab', $precio)");
}

echo "Tu reserva ha sido guardada correctamente.";
?>
