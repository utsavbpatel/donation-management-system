<?php
header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  
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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['userId'], $data['email'], $data['password'])) {
    $userId = $data['userId'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    $checkSql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Email already exists"]);
    } else {
        $insertSql = "INSERT INTO users (userId, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("sss", $userId, $email, $password);

        if ($stmt->execute()) {
            echo json_encode([                
            "success" => true,
            "message" => "Signup successful",
            "userId" => $userId, 
            "email" => $email ]);
        } else {
            echo json_encode(["error" => "Error inserting data: " . $conn->error]);
        }
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input or request method"]);
}


$conn->close();
?>
