<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

// Leer el JSON que enviamos desde el componente React
$data = json_decode(file_get_contents("php://input"), true);

$post_id   = $data['post_id'] ?? null;
$user_id   = $data['user_id'] ?? null;
$content   = $data['content'] ?? '';
$parent_id = $data['parent_id'] ?? null;

if (!$post_id || !$user_id || empty($content)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Insertar el comentario
    $stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, parent_id, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$post_id, $user_id, $content, $parent_id]);
    $comment_id = $pdo->lastInsertId();

    // 2. Procesar MENCIONES @Nombre
    // Esta regex captura el nombre después del @ hasta encontrar un espacio o fin de línea
    preg_match_all('/@([\w\s]+)/', $content, $matches);

    if (!empty($matches[1])) {
        foreach ($matches[1] as $name) {
            $clean_name = trim($name);
            // Buscamos al usuario mencionado
            $uStmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(full_name) LIKE LOWER(?) LIMIT 1");
            $uStmt->execute(["%$clean_name%"]);
            $target = $uStmt->fetch();

            // Si el usuario existe y no es el mismo que comenta, enviamos notificación
            if ($target && $target['id'] != $user_id) {
                $nStmt = $pdo->prepare("INSERT INTO notifications (from_user_id, to_user_id, post_id, comment_id, type, created_at) VALUES (?, ?, ?, ?, 'mention', NOW())");
                $nStmt->execute([$user_id, $target['id'], $post_id, $comment_id]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Error en el servidor: " . $e->getMessage()]);
}
