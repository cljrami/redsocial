<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

// Verificamos que se reciba el ID del usuario [cite: 2026-02-05]
$user_id = $_POST['user_id'] ?? null;

if ($user_id) {
    try {
        // Marcamos todas las notificaciones pendientes como leídas (1) [cite: 2026-02-05]
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE to_user_id = ? AND is_read = 0");
        $stmt->execute([$user_id]);

        echo json_encode([
            "success" => true,
            "message" => "Notificaciones actualizadas"
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "Error de base de datos: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "ID de usuario no proporcionado"
    ]);
}
