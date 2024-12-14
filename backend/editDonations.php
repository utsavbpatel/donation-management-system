<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
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


$userId = isset($_GET['userId']) ? $_GET['userId'] : null;

$data = json_decode(file_get_contents("php://input"), true);

if (!$userId || !$data['donationReceiptNo'] || !isset($data['donationAmount']) || !isset($data['date']) || !isset($data['time'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare("
    UPDATE Donations
    SET donorName = ?, donorMobileNo = ?, donorEmailId = ?, donationTypeId = ?, donationAmount = ?, date = ?, time = ?
    WHERE userId = ? AND donationReceiptNo = ?
");

$stmt->bind_param(
    'sssssssss',
    $data['donorName'],
    $data['donorMobileNo'],
    $data['donorEmailId'],
    $data['donationTypeId'],
    $data['donationAmount'],
    $data['date'],
    $data['time'],
    $userId,
    $data['donationReceiptNo']
);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Donation data updated successfully']);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'No matching record found to update']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Failed to execute the query']);
}

$stmt->close();
$conn->close();
?>
