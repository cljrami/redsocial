<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$post_id = $_GET['post_id'] ?? null;
$user_id = $_GET['user_id'] ?? 0;

if ($post_id) {
    try {
        // Ordenamos por el ID del padre (o el propio si es raíz) para agrupar hilos [cite: 2026-02-06]
        $query = "SELECT c.*, u.full_name, u.profile_photo, 
                  (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count,
                  (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = :user_id) as user_has_liked
                  FROM comments c 
                  JOIN users u ON c.user_id = u.id 
                  WHERE c.post_id = :post_id 
                  ORDER BY COALESCE(c.parent_id, c.id) ASC, c.created_at ASC";

        $stmt = $pdo->prepare($query);
        $stmt->execute(['post_id' => $post_id, 'user_id' => $user_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}