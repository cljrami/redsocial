<?php
// Reportar errores para saber qué pasa exactamente
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

$content = $_POST['content'] ?? '';
$user_id = $_POST['user_id'] ?? null;
$image_url = null;

// Procesar imagen
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/';
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $file_name = time() . '_' . basename($_FILES['image']['name']);
    $target_file = $upload_dir . $file_name;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
        // Guardamos la ruta que el navegador usará para leerla
        $image_url = 'https://laforesta.zona8.cl/api/posts/' . $target_file;
    }
}

if ($content || $image_url) {
    try {
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$user_id, $content, $image_url]);

        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error DB: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Publicacion vacia"]);
}