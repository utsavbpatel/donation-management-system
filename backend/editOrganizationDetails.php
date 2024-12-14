<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS,PUT");
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


if ($_SERVER['REQUEST_METHOD'] == 'PUT') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($_GET['userId']) && isset($data['organizationName'], $data['mobileNo'], $data['emailId'], $data['address'])) {
        $userId = $_GET['userId']; 
        $organizationName = $data['organizationName'];
        $mobileNo = $data['mobileNo'];
        $emailId = $data['emailId'];
        $address = $data['address'];

        $updateSql = "UPDATE organationDetails 
                      SET organizationName = ?, mobileNo = ?, emailId = ?, address = ? 
                      WHERE userId = ?";

        $stmt = $conn->prepare($updateSql);

        $stmt->bind_param("sssss", $organizationName, $mobileNo, $emailId, $address, $userId);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Details updated successfully"]);
            } else {
                echo json_encode(["error" => "No rows updated. Please check the userId or the data provided"]);
            }
        } else {
            echo json_encode(["error" => "Error updating data: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Invalid input. All fields are required"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
