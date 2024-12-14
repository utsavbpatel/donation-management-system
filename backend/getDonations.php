<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

    $query = "
        SELECT d.id, d.donationReceiptNo, d.donorName, d.donorMobileNo, d.donorEmailId, 
               d.donationAmount, d.date, d.time, dc.donationTypeId, dc.donationTypeName
        FROM Donations d
        JOIN DonationCategories dc ON d.donationTypeId = dc.donationTypeId
        WHERE d.userId = ?
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $userId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $donations = [];
        while ($row = $result->fetch_assoc()) {
            $donations[] = $row;
        }

        echo json_encode(["success" => true, "data" => $donations]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to fetch donations"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "userId is required"]);
}

$conn->close();
?>
