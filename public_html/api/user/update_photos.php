<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

// Capturamos el ID del usuario dinámicamente [cite: 2026-02-05]
$user_id = $_POST['user_id'] ?? null;
$type = $_POST['type'] ?? '';

if (!$user_id || !isset($_FILES['photo'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$folder = "../posts/uploads/";
if (!is_dir($folder)) mkdir($folder, 0777, true);

$filename = $type . "_user_" . $user_id . "_" . time() . ".jpg";
$upload_path = $folder . $filename;

// Mantenemos tu URL pública [cite: 2026-02-05]
$public_url = "https://laforesta.zona8.cl/api/posts/uploads/" . $filename;

if (move_uploaded_file($_FILES['photo']['tmp_name'], $upload_path)) {
    $column = ($type === 'profile') ? 'profile_photo' : 'cover_photo';
    $stmt = $pdo->prepare("UPDATE users SET $column = ? WHERE id = ?");
    $stmt->execute([$public_url, $user_id]);

    echo json_encode(["success" => true, "url" => $public_url]);
} else {
    echo json_encode(["success" => false, "message" => "Error al mover archivo"]);
}
