<?php
require '../commons/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (!isset($_GET['id']) || trim($_GET['id']) === '') {
        echo json_encode(["error" => "Falta el ID de la categoría"]);
        exit();
    }
    $id = $_GET['id'];
    
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }
    
    if (!isset($data['name']) || trim($data['name']) == '') {
        echo json_encode(["error" => "El nombre es obligatorio"]);
        exit();
    }
    if (!isset($data['user_id']) || !is_numeric($data['user_id']) || $data['user_id'] <= 0) {
        echo json_encode(["error" => "El user_id es obligatorio, debe ser numérico y mayor a 0"]);
        exit();
    }

    try {
        $q = "UPDATE task.category SET name = :name, user_id = :user_id WHERE id = :id";
        $stmt = $db->prepare($q);
        $stmt->execute([
        "name" => $data["name"],
        "user_id" => (int)$data["user_id"],
        "id"   => (int)$id
        ]);
        echo json_encode(["success" => true]);
        } catch(PDOException $e) {
        echo json_encode(["error" => "Error al actualizar la categoría: " . $e->getMessage()]);
        }

} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>

