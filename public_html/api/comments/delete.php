<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$comment_id = $_POST['comment_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;

if (!$comment_id || !$user_id) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    // Solo borramos si el comentario pertenece al usuario
    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
    $stmt->execute([$comment_id, $user_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No tienes permiso"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
