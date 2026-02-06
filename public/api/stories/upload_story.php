<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

// 1. Ruta física
$upload_dir = __DIR__ . "/../../uploads/stories/";
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$user_id = $_POST['user_id'] ?? null;
$caption = $_POST['caption'] ?? "";
$file = $_FILES['story_image'] ?? null;

if ($user_id && $file && $file['error'] === UPLOAD_ERR_OK) {
    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];

    if (!in_array($file_ext, $allowed_exts)) {
        echo json_encode(["success" => false, "error" => "Extensión no permitida"]);
        exit;
    }

    $file_name = "story_" . time() . "_" . uniqid() . "." . $file_ext;
    $target_path = $upload_dir . $file_name;
    $db_path = "/uploads/stories/" . $file_name;

    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        try {
            // INICIAMOS TRANSACCIÓN PARA ASEGURAR AMBAS INSERCIONES
            $pdo->beginTransaction();

            // 1. Guardar en la tabla de historias (Para el carrusel de arriba)
            $stmt1 = $pdo->prepare("INSERT INTO stories (user_id, image_url, caption) VALUES (?, ?, ?)");
            $stmt1->execute([$user_id, $db_path, $caption]);

            // 2. Guardar en la tabla de posts (Para que aparezca en el Feed con el texto de historia)
            // Usamos post_type = 'story_share'
            $stmt2 = $pdo->prepare("INSERT INTO posts (user_id, content, image_url, post_type) VALUES (?, ?, ?, 'story_share')");
            $stmt2->execute([$user_id, $caption, $db_path]);

            $pdo->commit();

            echo json_encode([
                "success" => true,
                "message" => "¡Historia publicada en carrusel y muro!",
                "db_path" => $db_path
            ]);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            echo json_encode(["success" => false, "error" => "Error DB: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Error al mover el archivo"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Datos incompletos o archivo corrupto"]);
}
