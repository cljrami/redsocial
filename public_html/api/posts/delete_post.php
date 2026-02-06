<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$post_id = $_POST['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
    exit;
}

try {
    // Eliminamos el post (asumiendo que los likes y comentarios se borran por ON DELETE CASCADE)
    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $success = $stmt->execute([$post_id]);

    echo json_encode(["success" => $success]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
