<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$post_id = $_GET['post_id'] ?? null;
$current_user = $_GET['user_id'] ?? 0;

if ($post_id) {
    // Consulta que trae el nombre, el tiempo transcurrido y cuenta los likes
    $query = "SELECT c.*, u.full_name, 
              (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as likes_count,
              (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = :user_id) as user_has_liked
              FROM comments c 
              JOIN users u ON c.user_id = u.id 
              WHERE c.post_id = :post_id 
              ORDER BY c.created_at ASC";

    $stmt = $pdo->prepare($query);
    $stmt->execute(['post_id' => $post_id, 'user_id' => $current_user]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
