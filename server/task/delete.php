<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || $_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_GET['id']) || trim($_GET['id']) == '') {
        echo json_encode(["error" => "Falta el ID de la tarea"]);
        exit();
    }
    $id = $_GET['id'];
    try {
        $q = "DELETE FROM task.task WHERE id = :id";
        $stmt = $db->prepare($q);
        $stmt->execute(["id" => $id]);
        echo json_encode(["success" => true]);
    } catch(PDOException $e) {
        echo json_encode(["error" => "Error al eliminar la tarea: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>
