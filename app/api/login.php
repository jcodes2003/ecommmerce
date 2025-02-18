<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

class Login
{

    function register($json)
    {
        include 'connect.php';

        $json = json_decode($json, true);
        $hashedPassword = password_hash($json['password'], PASSWORD_DEFAULT); // Hash the password

        $sql = "INSERT INTO users (fname, lname, username, password, roleID, status, branch_id) VALUES (:fname, :lname, :username, :password, :roleID, :status, null)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam('fname', $json['fname']);
        $stmt->bindParam('lname', $json['lname']);
        $stmt->bindParam('username', $json['username']);
        $stmt->bindParam('password', $hashedPassword); // Store hashed password
        $stmt->bindParam('roleID', $json['roleID']);
        $stmt->bindParam('status', $json['status']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;

        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    function login($json)
    {
        include 'connect.php';
    
        $json = json_decode($json, true);
        
        // Debug incoming request
        error_log("Received login request with data: " . print_r($json, true));
    
        $sql = "SELECT * FROM users WHERE username = :username";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $json['username']);
        $stmt->execute();
    
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $response = ['success' => false, 'message' => '', 'debug' => []];
    
        // Add debug information
        $response['debug']['received_username'] = $json['username'];
        $response['debug']['user_found'] = !empty($user);
    
        if ($user) {
            $response['debug']['password_verify_result'] = password_verify($json['password'], $user['password']);
            
            if (password_verify($json['password'], $user['password'])) {
                $response['success'] = true;
                $response['message'] = 'Login successful';
                $response['user'] = [
                    'user_id' => $user['user_id'],
                    'fname' => $user['fname'],
                    'lname' => $user['lname'],
                    'username' => $user['username'],
                    'roleID' => $user['roleID'],
                    'branch_id' => $user['branch_id'],
                    'status' => $user['status']

                ];
            } else {
                $response['message'] = 'Invalid password';
            }
        } else {
            $response['message'] = 'Username not found';
        }
    
        error_log("Sending response: " . print_r($response, true));
        
        unset($conn);
        unset($stmt);
        return json_encode($response);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = $_GET['operation'];
    $json = $_GET['json'];
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = $_POST['json'];
}

$login = new Login();
switch ($operation) {
    case "login":
        echo $login->login($json);
        break;
    case "register":
        echo $login->register($json);
        break;
}
