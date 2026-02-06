<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    // Traemos la notificación, el nombre de quien notificó y su foto [cite: 2026-02-04]
    $query = "SELECT n.*, u.full_name as from_name, u.profile_photo as from_photo 
              FROM notifications n
              JOIN users u ON n.from_user_id = u.id
              WHERE n.to_user_id = ? 
              ORDER BY n.created_at DESC LIMIT 10";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}