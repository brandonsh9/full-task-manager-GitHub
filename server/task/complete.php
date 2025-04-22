<?php
require '../commons/db.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'PATCH' || $_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_GET['id']) || trim($_GET['id']) == '') {
        echo json_encode(["error" => "Falta el ID de la tarea"]);
        exit();
    }
    $id = $_GET['id'];
    
    
    $data = json_decode(file_get_contents("php://input"), true);
    $newStatus = isset($data['completed']) ? $data['completed'] : true;
    
    try {
        $q = "UPDATE task.task SET complete = :complete WHERE id = :id";
        $stmt = $db->prepare($q);
        $stmt->execute(["complete" => $newStatus, "id" => $id]);
        echo json_encode(["success" => true]);
    } catch(PDOException $e) {
        echo json_encode(["error" => "Error al actualizar la tarea: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>
