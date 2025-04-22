<?php
require '../commons/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        $q = "SELECT id, name, user_id FROM task.category ORDER BY name";
        $stmt = $db->prepare($q);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Error al listar las categorías: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Bad Request"]);
}
?>

