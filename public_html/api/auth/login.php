<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// 1. Incluimos la conexión que ya configuramos
include_once '../config/db.php';

// 2. Leemos los datos que envía el componente React (en formato JSON)
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user) && !empty($data->pass)) {
    try {
        // 3. Buscamos al usuario. 
        // Nota: En un proyecto real usaríamos password_verify, 
        // pero para este inicio usaremos coincidencia directa.
        $stmt = $pdo->prepare("SELECT id, username, full_name, role_id FROM users WHERE username = ? AND password = ?");
        $stmt->execute([$data->user, $data->pass]);
        $user = $stmt->fetch();

        if ($user) {
            // 💡 Si existe, devolvemos éxito y sus datos básicos
            echo json_encode([
                "success" => true,
                "message" => "¡Bienvenido, " . $user['full_name'] . "!",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['full_name'],
                    "role" => $user['role_id']
                ]
            ]);
        } else {
            // ❌ Si no coincide, devolvemos error
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
