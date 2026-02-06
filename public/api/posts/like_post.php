<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

// PostCard envía FormData, usamos $_POST
$post_id = $_POST['post_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;

if ($post_id && $user_id) {
    try {
        // Buscamos en 'post_likes' para ser consistentes con tu get_all.php
        $check = $pdo->prepare("SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?");
        $check->execute([$post_id, $user_id]);

        if ($check->rowCount() > 0) {
            $stmt = $pdo->prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?");
            $action = "unliked";
        } else {
            $stmt = $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)");
            $action = "liked";
        }

        $success = $stmt->execute([$post_id, $user_id]);
        echo json_encode(["success" => $success, "action" => $action]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
