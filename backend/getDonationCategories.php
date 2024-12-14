<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    $selectSql = "SELECT * FROM donationCategories WHERE userId = ?";
    
    $stmt = $conn->prepare($selectSql);
    
    $stmt->bind_param("s", $userId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $donationCategories = [];

        while ($row = $result->fetch_assoc()) {
            $donationCategories[] = $row;
        }

        echo json_encode(["success" => true, "data" => $donationCategories]);
    } else {
        echo json_encode(["error" => "Error fetching data: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input. userId is required"]);
}

$conn->close();
?>
