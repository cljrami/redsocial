<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$comment_id = $_POST['comment_id'] ?? null;
$user_id = $_POST['user_id'] ?? null;

if ($comment_id && $user_id && $user_id !== "null") {
    try {
        $check = $pdo->prepare("SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?");
        $check->execute([$comment_id, $user_id]);

        if ($check->rowCount() > 0) {
            $stmt = $pdo->prepare("DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?");
        } else {
            $stmt = $pdo->prepare("INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)");
        }
        $success = $stmt->execute([$comment_id, $user_id]);
        echo json_encode(["success" => $success]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
