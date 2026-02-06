<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

try {
    // La subconsulta (SELECT COUNT(*) FROM comments...) es la que suma el número [cite: 2026-02-04]
    $query = "SELECT p.*, u.full_name, u.profile_photo,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_total,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_total,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_has_liked
              FROM posts p
              LEFT JOIN users u ON p.user_id = u.id
              ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($posts ? $posts : []);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}