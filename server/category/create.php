<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Bad request"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

if (!isset($data['name']) || trim($data['name']) === '') {
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit;
}
if (!isset($data['user_id']) || !is_numeric($data['user_id']) || $data['user_id'] <= 0) {
    echo json_encode(["error" => "El user_id es obligatorio, debe ser numérico y mayor a 0"]);
    exit;
}

try {
    $stmt = $db->prepare("
        INSERT INTO task.category (name, user_id)
        VALUES (:name, :user_id)
    ");
    $stmt->execute([
        "name"    => $data['name'],
        "user_id" => $data['user_id']
    ]);
    echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
} catch(PDOException $e) {
    echo json_encode(["error" => "Error al crear categoría: " . $e->getMessage()]);
}
