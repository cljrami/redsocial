<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

// Obtenemos el ID del usuario logueado para marcar sus propios likes
$current_user = $_GET['user_id'] ?? 0;

try {
    $query = "SELECT p.*, u.full_name, 
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_total,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_total,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = :current_user) as user_has_liked
              FROM posts p 
              JOIN users u ON p.user_id = u.id 
              ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute(['current_user' => $current_user]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos el booleano de user_has_liked (que viene como 0 o 1) a true/false para React
    foreach ($posts as &$post) {
        $post['user_has_liked'] = (bool)$post['user_has_liked'];
        $post['likes_total'] = (int)$post['likes_total'];
        $post['comments_total'] = (int)$post['comments_total'];
    }

    echo json_encode($posts);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
