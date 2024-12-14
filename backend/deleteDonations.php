<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS,DELETE");
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
$donationReceiptNo = isset($_GET['dataId']) ? $_GET['dataId'] : null;


if (!$userId || !$donationReceiptNo) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}


$stmt = $conn->prepare("
    DELETE FROM Donations
    WHERE userId = ? AND donationReceiptNo = ?
");

$stmt->bind_param('ss', $userId, $donationReceiptNo);


if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Donation record deleted successfully']);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'No matching record found to delete']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Failed to execute the query']);
}

$stmt->close();
$conn->close();
?>
