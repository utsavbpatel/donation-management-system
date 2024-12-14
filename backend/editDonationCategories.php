<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS,PUT");
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

$data = json_decode(file_get_contents("php://input"), true);


if (isset($data['donationTypeId'], $data['userId'], $data['donationTypeName'])) {
    $donationTypeId = $data['donationTypeId'];
    $userId = $data['userId'];
    $donationTypeName = $data['donationTypeName'];


    $updateSql = "UPDATE donationCategories 
                  SET donationTypeName = ?, userId = ? 
                  WHERE donationTypeId = ?";
    

    $stmt = $conn->prepare($updateSql);
    

    $stmt->bind_param("sss", $donationTypeName, $userId, $donationTypeId);


    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Donation category updated successfully"]);
        } else {
            echo json_encode(["error" => "No record found with the provided donationTypeId"]);
        }
    } else {
        echo json_encode(["error" => "Error updating data: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input. All fields are required"]);
}

$conn->close();
?>
