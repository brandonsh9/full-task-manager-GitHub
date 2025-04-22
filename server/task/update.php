<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT' || $_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_GET['id']) || trim($_GET['id']) == '') {
        echo json_encode(["error" => "Falta el ID de la tarea"]);
        exit();
    }
    $id = $_GET['id'];
    
    
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }
    
    if (
        !isset($data['title']) || trim($data['title']) == '' ||
        !isset($data['user_id']) || trim($data['user_id']) == '' ||
        !isset($data['category_id']) || trim($data['category_id']) == ''
    ) {
        echo json_encode(["error" => "Faltan campos obligatorios"]);
        exit();
    }
    
    try {
        $q = "UPDATE task.task 
              SET title = :title, 
                  description = :description, 
                  due_date = :due_date, 
                  complete = :complete, 
                  user_id = :user_id, 
                  category_id = :category_id 
              WHERE id = :id";
        $stmt = $db->prepare($q);
        $stmt->execute([
            "title"       => $data["title"],
            "description" => $data["description"],
            "due_date"    => $data["due_date"],
            "complete"    => $data["complete"], 
            "user_id"     => $data["user_id"],
            "category_id" => $data["category_id"],
            "id"          => $id
        ]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al actualizar la tarea: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>

