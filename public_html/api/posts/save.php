<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$content = $_POST['content'] ?? '';
$user_id = $_POST['user_id'] ?? null;
// NUEVO: Aceptamos URL directa si viene de una actualización de perfil/portada [cite: 2026-02-05]
$image_url = $_POST['image_url'] ?? null;

if (!$user_id || $user_id == "null" || $user_id == "undefined") {
    echo json_encode(["success" => false, "message" => "ID de usuario inválido"]);
    exit;
}

// 1. Lógica de subida de archivo (solo si no viene una image_url previa) [cite: 2026-02-05]
if (!$image_url && isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
    $file_name = time() . '_' . basename($_FILES['image']['name']);
    $target_file = $upload_dir . $file_name;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
        $image_url = '/api/posts/' . $target_file;
    }
}

// 2. Inserción en la base de datos
if ($content || $image_url) {
    try {
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$user_id, $content, $image_url]);
        $new_post_id = $pdo->lastInsertId();

        // --- SISTEMA DE NOTIFICACIONES (MANTENIDO INTACTO) --- [cite: 2026-02-05]

        // Caso Especial: @todos
        if (stripos($content, '@todos') !== false) {
            $stmtTodos = $pdo->prepare("INSERT INTO notifications (from_user_id, to_user_id, post_id, type, created_at) 
                                       SELECT ?, id, ?, 'mention', NOW() FROM users WHERE id <> ?");
            $stmtTodos->execute([$user_id, $new_post_id, $user_id]);
        }

        // Caso: Menciones Individuales
        preg_match_all('/@([\w\s]+)/', $content, $matches);
        if (!empty($matches[1])) {
            foreach ($matches[1] as $name) {
                $clean_name = trim($name);
                if (strtolower($clean_name) === 'todos') continue;

                $uStmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(TRIM(full_name)) = LOWER(?) LIMIT 1");
                $uStmt->execute([$clean_name]);
                $target = $uStmt->fetch();

                if ($target && $target['id'] != $user_id) {
                    $check = $pdo->prepare("SELECT id FROM notifications WHERE to_user_id = ? AND post_id = ? AND from_user_id = ?");
                    $check->execute([$target['id'], $new_post_id, $user_id]);
                    if (!$check->fetch()) {
                        $nStmt = $pdo->prepare("INSERT INTO notifications (from_user_id, to_user_id, post_id, type, created_at) VALUES (?, ?, ?, 'mention', NOW())");
                        $nStmt->execute([$user_id, $target['id'], $new_post_id]);
                    }
                }
            }
        }

        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error DB: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Sin contenido"]);
}
