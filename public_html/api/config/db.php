<?php
// Credenciales de tu entorno redsocial_app 🗄️
$host = 'localhost';
$db   = 'redsocial_app';
$user = 'redsocial_app';
$pass = 'tbbwG959A5Q2UupGcJg6';

try {
    // Usamos PDO para una conexión segura y moderna 🛡️
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si hay un error, lo enviamos como JSON para que el frontend lo entienda
    header('Content-Type: application/json');
    die(json_encode(["success" => false, "message" => "Error de conexión"]));
}
?>