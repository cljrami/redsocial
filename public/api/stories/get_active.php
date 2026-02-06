<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

try {
    // IMPORTANTE: Seleccionamos image_url para la foto grande 
    // y u.profile_photo como 'user_photo' para el círculo azul.
    $query = "SELECT s.*, u.full_name, u.profile_photo as user_photo 
              FROM stories s 
              JOIN users u ON s.user_id = u.id 
              WHERE s.created_at >= NOW() - INTERVAL 1 DAY 
              ORDER BY s.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($stories);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
