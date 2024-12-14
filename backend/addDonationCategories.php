<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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


if (isset($data['userId'], $data['donationTypeId'], $data['donationTypeName'])) {
    $userId = $data['userId'];
    $donationTypeId = $data['donationTypeId'];
    $donationTypeName = $data['donationTypeName'];


    $insertSql = "INSERT INTO donationCategories (userId, donationTypeId, donationTypeName) 
                  VALUES (?, ?, ?)";


    $stmt = $conn->prepare($insertSql);


    $stmt->bind_param("sss", $userId, $donationTypeId, $donationTypeName);


    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Donation category added successfully"]);
    } else {
        echo json_encode(["error" => "Error inserting data: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input. All fields are required"]);
}

$conn->close();
