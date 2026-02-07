<?php
// api/comments/delete.php
header('Content-Type: application/json');
include_once '../config/db.php';

if (!isset($_GET['id']) || !isset($_GET['user_id'])) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
    exit;
}

$id = $_GET['id'];
$user_id = $_GET['user_id'];

try {
    // Eliminamos el comentario solo si el user_id coincide con el dueño
    // También eliminamos las respuestas que tengan este ID como padre
    $stmt = $pdo->prepare("
        DELETE FROM comments 
        WHERE (id = ? OR parent_id = ?) 
        AND user_id = ?
    ");

    // Pasamos el ID del comentario, el ID para las respuestas y el ID del usuario
    $success = $stmt->execute([$id, $id, $user_id]);

    echo json_encode(["success" => $success]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
