<?php
// api/comments/delete.php
include_once '../config/db.php';
$id = $_GET['id'];
$user_id = $_GET['user_id'];

// Borramos el comentario (y sus respuestas si tu DB tiene ON DELETE CASCADE)
$stmt = $pdo->prepare("DELETE FROM comments WHERE id = ? AND (user_id = ? OR (SELECT role FROM users WHERE id = ?) = 'admin')");
$success = $stmt->execute([$id, $user_id, $user_id]);

echo json_encode(["success" => $success]);