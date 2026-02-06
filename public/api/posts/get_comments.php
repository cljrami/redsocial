<?php
include_once '../config/db.php';
$post_id = $_GET['post_id'] ?? 0;
$user_id = $_GET['user_id'] ?? 0;

try {
    $query = "SELECT 
                c.*, 
                u.full_name, u.profile_photo,
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count,
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as user_has_liked
              FROM comments c
              JOIN users u ON c.user_id = u.id
              WHERE c.post_id = ?
              ORDER BY c.created_at ASC";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id, $post_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments);
} catch (Exception $e) {
    echo json_encode([]);
}
