<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user) && !empty($data->pass)) {
    try {
        // Añadimos las fotos a la consulta SQL [cite: 2026-02-05]
        $stmt = $pdo->prepare("SELECT id, username, full_name, role_id, profile_photo, cover_photo FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$data->user, $data->pass]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode([
                "success" => true,
                "message" => "¡Bienvenido, " . $user['full_name'] . "!",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['full_name'],
                    "username" => $user['username'],
                    "role" => $user['role_id'],
                    "profile_photo" => $user['profile_photo'], // Ahora se envían correctamente [cite: 2026-02-05]
                    "cover_photo" => $user['cover_photo']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Usuario o clave incorrectos."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error en el servidor."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
}
