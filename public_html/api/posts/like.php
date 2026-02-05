<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->post_id) && !empty($data->user_id)) {
    try {
        // Verificar si ya existe el like
        $check = $pdo->prepare("SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?");
        $check->execute([$data->post_id, $data->user_id]);

        if ($check->rowCount() > 0) {
            // Si existe, lo quitamos (unlike)
            $stmt = $pdo->prepare("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?");
            $action = "unliked";
        } else {
            // Si no existe, lo agregamos (like)
            $stmt = $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)");
            $action = "liked";
        }

        $stmt->execute([$data->post_id, $data->user_id]);
        echo json_encode(["success" => true, "action" => $action]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
