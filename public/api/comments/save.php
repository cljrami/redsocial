<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

// Leemos tanto de $_POST como de JSON por si acaso
$post_id = $_POST['post_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;
$content = $_POST['content'] ?? '';

// Si $_POST viene vacío, intentamos leer el JSON (Astro/React a veces lo envía así)
if (!$post_id) {
    $data = json_decode(file_get_contents("php://input"), true);
    $post_id = $data['post_id'] ?? null;
    $user_id = $data['user_id'] ?? null;
    $content = $data['content'] ?? '';
}

if (!$post_id || !$user_id || empty($content)) {
    echo json_encode(["success" => false, "message" => "Faltan datos: post=$post_id, user=$user_id"]);
    exit;
}

try {
    // Inserción directa sin depender de otras columnas
    $stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())");
    $success = $stmt->execute([$post_id, $user_id, $content]);

    if ($success) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No se pudo insertar en la DB"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
