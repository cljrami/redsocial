<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$post_id = $_POST['post_id'] ?? null;
$user_id = $_POST['user_id'] ?? null; // Seguridad

if ($post_id && $user_id) {
    try {
        // Solo borra si el post pertenece al usuario
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
        $stmt->execute([$post_id, $user_id]);
        echo json_encode(["success" => $stmt->rowCount() > 0]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
