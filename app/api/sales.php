<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
class Sales
{


    function getSalesData($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
            DATE_FORMAT(date_sold, '%Y-%m') AS month, 
            SUM(totalamount) AS totalamount, 
            (SELECT COUNT(user_id) FROM users) AS user_count
            FROM tblsales
            GROUP BY month
            ORDER BY month;";


        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formattedData = [];
            foreach ($returnValue as $row) {
                $formattedData[] = [
                    'date_sold' => $row['month'],
                    'totalamount' => $row['totalamount'],
                    'user_count' => $row['user_count']
                ];
            }

            error_log("Fetched sales data: " . json_encode($formattedData));

            return json_encode($formattedData);
        } catch (PDOException $e) {
            error_log("Error fetching sales data: " . $e->getMessage());
            return json_encode([]);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = $_GET['operation'];
    $json = isset($_GET['json']) ? $_GET['json'] : null;
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = isset($_POST['json']) ? $_POST['json'] : null;
}

$sale = new Sales();
switch ($operation) {
    case "getSalesData":
        echo $sale->getSalesData($json);
        break;
}
