<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/load_env.php';

$host = $env['DB_HOST']; 
$username = $env['DB_USERNAME'];
$password = $env['DB_PASSWORD'];
$dbname = $env['DB_DBNAME'];


$conn = new mysqli($host, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    if (isset($_GET['userId'])) {
        $userId = $_GET['userId'];

        $deleteSql = "DELETE FROM organationDetails WHERE userId = ?";

        $stmt = $conn->prepare($deleteSql);

        $stmt->bind_param("s", $userId);


        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
            } else {
                echo json_encode(["error" => "No record found with the provided userId"]);
            }
        } else {
            echo json_encode(["error" => "Error deleting record: " . $stmt->error]);
        }


        $stmt->close();
    } else {
        echo json_encode(["error" => "Invalid input. userId is required"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}


$conn->close();
?>
