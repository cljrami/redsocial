<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$post_id = $_POST['post_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;

if ($post_id && $user_id) {
    try {
        $pdo->beginTransaction();

        // 1. Verificamos si ya existe el like
        $check = $pdo->prepare("SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?");
        $check->execute([$post_id, $user_id]);

        if ($check->rowCount() > 0) {
            // Ya existe -> Quitar Like
            $pdo->prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?")->execute([$post_id, $user_id]);
            $pdo->prepare("UPDATE posts SET likes_total = GREATEST(0, likes_total - 1) WHERE id = ?")->execute([$post_id]);
            $action = "unliked";
        } else {
            // No existe -> Poner Like
            $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)")->execute([$post_id, $user_id]);
            $pdo->prepare("UPDATE posts SET likes_total = likes_total + 1 WHERE id = ?")->execute([$post_id]);
            $action = "liked";
        }

        $pdo->commit();
        echo json_encode(["success" => true, "action" => $action]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
