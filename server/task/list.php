<?php
require '../commons/db.php';


header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        
        $q = "SELECT id, title, description, due_date, complete AS completed, user_id, category_id 
              FROM task.task 
              ORDER BY title";
        $stmt = $db->prepare($q);
        $stmt->execute();
        $task = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($task);
    } catch(PDOException $e) {
        echo json_encode(["error" => "Error al listar las tareas: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>
