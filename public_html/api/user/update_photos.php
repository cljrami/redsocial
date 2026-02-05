<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$user_id = $_POST['user_id'] ?? 1;
$type = $_POST['type'] ?? ''; // 'profile' o 'cover'

if (!isset($_FILES['photo'])) {
    echo json_encode(["success" => false, "message" => "No se recibió imagen"]);
    exit;
}

$folder = "../posts/uploads/";
if (!is_dir($folder)) mkdir($folder, 0777, true);

$filename = $type . "_admin_" . time() . ".jpg";
$upload_path = $folder . $filename;
// Ajusta esta URL a tu dominio real
$public_url = "https://laforesta.zona8.cl/api/posts/uploads/" . $filename;

if (move_uploaded_file($_FILES['photo']['tmp_name'], $upload_path)) {
    // Actualizar Base de Datos
    $column = ($type === 'profile') ? 'profile_photo' : 'cover_photo';
    $stmt = $pdo->prepare("UPDATE users SET $column = ? WHERE id = ?");
    $stmt->execute([$public_url, $user_id]);

    echo json_encode(["success" => true, "url" => $public_url]);
} else {
    echo json_encode(["success" => false]);
}
