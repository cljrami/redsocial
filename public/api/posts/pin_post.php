<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$post_id = $_POST['post_id'] ?? null;
$action = $_POST['action'] ?? 'pin'; // 'pin' o 'unpin'

if (!$post_id) {
    echo json_encode(["success" => false, "message" => "ID faltante"]);
    exit;
}

// Primero quitamos el 'fijado' de cualquier otro post (solo uno a la vez)
if ($action === 'pin') {
    $pdo->prepare("UPDATE posts SET is_pinned = 0")->execute();
}

$is_pinned = ($action === 'pin') ? 1 : 0;
$stmt = $pdo->prepare("UPDATE posts SET is_pinned = ? WHERE id = ?");
$success = $stmt->execute([$is_pinned, $post_id]);

echo json_encode(["success" => $success]);