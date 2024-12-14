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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}


$userId = isset($_GET['userId']) ? $_GET['userId'] : null;
$dataId = isset($_GET['dataId']) ? $_GET['dataId'] : null;


if (!$userId || !$dataId) {
    echo json_encode(["error" => "Invalid input. 'userId' and 'dataId' are required."]);
    exit();
}


$deleteSql = "DELETE FROM donationCategories WHERE userId = ? AND donationTypeId = ?";
$stmt = $conn->prepare($deleteSql);


$stmt->bind_param("ss", $userId, $dataId);


if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Donation category deleted successfully."]);
    } else {
        echo json_encode(["error" => "No matching record found to delete."]);
    }
} else {
    echo json_encode(["error" => "Error deleting data: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
