<?php
$conn = new mysqli('localhost', 'root', '', 'hotelJquery');
$result = $conn->query("SELECT id, nombre FROM habitaciones");
$habitaciones = [];
while ($row = $result->fetch_assoc()) {
    $habitaciones[] = $row;
}
echo json_encode($habitaciones);
?>
