<?php
require '../commons/db.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    
    if (
        isset($data['title']) && trim($data['title']) !== '' &&
        isset($data['user_id']) && trim($data['user_id']) !== '' &&
        isset($data['category_id']) && trim($data['category_id']) !== ''
    ) {
        try {
            
            $q = "INSERT INTO task.task(title, description, due_date, complete, user_id, category_id)
                  VALUES (:title, :description, :due_date, :complete, :user_id, :category_id)";
            $stmt = $db->prepare($q);
            $stmt->execute([
                "title"       => $data["title"],
                "description" => isset($data["description"]) ? $data["description"] : null,
                "due_date"   => isset($data["due_date"]) ? $data["due_date"] : null,
                
                "complete"    => isset($data["completed"]) ? $data["completed"] : 0,
                "user_id"     => $data["user_id"],
                "category_id" => $data["category_id"]
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Tarea creada correctamente"
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "error"   => "Error en la conexión: " . $e->getMessage()
            ]);
            exit();
        }
    } else {
        echo json_encode([
            "success" => false,
            "error"   => "Datos incompletos"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "error"   => "Método HTTP no permitido"
    ]);
}
?>
