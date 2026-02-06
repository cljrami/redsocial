<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$from_user_id = $data['from_user_id'] ?? null;
$to_user_id = $data['to_user_id'] ?? null;
$post_id = $data['post_id'] ?? null;
$type = 'mention'; // Tipo de notificación [cite: 2026-02-04]

if ($from_user_id && $to_user_id && $post_id) {
    try {
        $stmt = $pdo->prepare("INSERT INTO notifications (from_user_id, to_user_id, post_id, type, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$from_user_id, $to_user_id, $post_id, $type]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>