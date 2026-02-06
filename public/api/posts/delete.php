<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$post_id = $_POST['post_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;

if (!$post_id || !$user_id) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    // Solo borramos si el post pertenece al usuario [cite: 2026-02-05]
    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$post_id, $user_id]);

    if ($stmt->rowCount() > 0) {
        // También borramos notificaciones asociadas para limpiar la DB [cite: 2026-02-05]
        $pdo->prepare("DELETE FROM notifications WHERE post_id = ?")->execute([$post_id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No tienes permiso o el post no existe"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}