<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
class Add
{

    function user($json)
    {
        include 'connect.php';

        $json = json_decode($json, true);

        // If branch_id is not provided, set it to NULL
        $branch_id = isset($json['branch_id']) ? $json['branch_id'] : null;

        $sql = "INSERT INTO users (
            fname,
            lname,
            username,
            password,
            status,
            roleID,
            branch_id
        ) VALUES (:fname, :lname, :username, :password, :status, :roleID, :branch_id)";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':fname', $json['fname']);
            $stmt->bindParam(':lname', $json['lname']);
            $stmt->bindParam(':username', $json['username']);

            // Hash the password for security
            $hashedPassword = password_hash($json['password'], PASSWORD_DEFAULT);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':status', $json['status']);
            $stmt->bindParam(':roleID', $json['roleID']);

            // Bind branch_id, if not null
            if ($branch_id === null) {
                $stmt->bindValue(':branch_id', null, PDO::PARAM_NULL);
            } else {
                $stmt->bindParam(':branch_id', $branch_id);
            }

            $stmt->execute();
            $returnValue = $stmt->rowCount() > 0 ? 1 : 0;
        } catch (PDOException $e) {
            $returnValue = array(
                'status' => 0,
                'message' => 'Error: ' . $e->getMessage()
            );
        }

        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }


    function getUsers($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
        user_id,
        fname,
        lname,
        username,
        password,
        status,
        roleID
        FROM users";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
    function getStatus($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
        *
        FROM status";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
    function getRole($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
        *
        FROM role";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }

    function updateUserStatus($json)
    {
        include 'connect.php';

        $json = json_decode($json, true);
        $sql = "UPDATE users SET status = :status WHERE user_id = :user_id";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':status', $json['status']);
            $stmt->bindParam(':user_id', $json['user_id']);

            $stmt->execute();
            $returnValue = array(
                'status' => $stmt->rowCount() > 0 ? 1 : 0,
                'message' => $stmt->rowCount() > 0 ? 'Status updated successfully' : 'No changes made'
            );
        } catch (PDOException $e) {
            $returnValue = array(
                'status' => 0,
                'message' => 'Error: ' . $e->getMessage()
            );
        }

        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
    function getBranch($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
            branch_id,
            branch,
            status
        FROM branch
        ORDER BY branch_id";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

            error_log("Fetched branch data: " . json_encode($returnValue));

            return json_encode($returnValue);
        } catch (PDOException $e) {
            error_log("Error fetching branch data: " . $e->getMessage());
            return json_encode([]);
        }
    }
    function updateBranchStatus($json)
    {
        include 'connect.php';

        $data = json_decode($json, true);

        error_log("Updating branch status with data: " . $json);

        $sql = "UPDATE branch SET status = :status WHERE branch_id = :branch_id";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':status', $data['status']);
            $stmt->bindParam(':branch_id', $data['branch_id']);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $returnValue = array(
                    'status' => 1,
                    'message' => 'Branch status updated successfully'
                );
            } else {
                $returnValue = array(
                    'status' => 0,
                    'message' => 'No changes made. Branch ID: ' . $data['branch_id'] . ', Status: ' . $data['status']
                );
            }
        } catch (PDOException $e) {
            $returnValue = array(
                'status' => 0,
                'message' => 'Error: ' . $e->getMessage()
            );
            error_log("Database error: " . $e->getMessage());
        }

        return json_encode($returnValue);
    }
    function addBranch($json)
    {
        include 'connect.php';

        $json = json_decode($json, true);
        $sql = "INSERT INTO branch (
            branch,
            location,
            status
        ) VALUES (:branch, :location, :status)";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':branch', $json['branch']);
            $stmt->bindParam(':location', $json['location']);
            $stmt->bindParam(':status', $json['status']);
            $stmt->execute();
            $returnValue = array(
                'status' => $stmt->rowCount() > 0 ? 1 : 0,
                'message' => $stmt->rowCount() > 0 ? 'Branch added successfully' : 'Failed to add branch'
            );
        } catch (PDOException $e) {
            $returnValue = array(
                'status' => 0,
                'message' => 'Error: ' . $e->getMessage()
            );
        }

        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
    function addProduct($json)
    {
        include 'connect.php';

        $json = json_decode($json, true);
        $product = $json['product'];
        $price = $json['price'];
        $quantity = $json['quantity'];
        $expiration_date = $json['expiration_date'];

        // Check if branch_id is provided, otherwise set it to null
        $branch_id = isset($json['branch_id']) ? $json['branch_id'] : null;

        // Handle image upload
        $imgFilename = ''; // Initialize as an empty string for cases where no image is uploaded
        if (isset($_FILES['img']) && $_FILES['img']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['img']['tmp_name'];
            $fileName = $_FILES['img']['name'];
            $fileSize = $_FILES['img']['size'];
            $fileType = $_FILES['img']['type'];

            // Define upload directory
            $uploadDir = '../../public/assets/productImg/'; // Set the upload directory
            $destination = $uploadDir . basename($fileName);

            // Move file to the upload directory
            if (move_uploaded_file($fileTmpPath, $destination)) {
                $imgFilename = basename($fileName); // Save only the filename to the database
            } else {
                return json_encode([
                    'status' => 0,
                    'message' => 'Failed to upload image'
                ]);
            }
        }

        // Prepare SQL query
        $sql = "INSERT INTO tblproduct (product, price, quantity, expiration_date, img, branch_id) 
                VALUES (:product, :price, :quantity, :expiration_date, :img, :branch_id)";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':product', $product);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':expiration_date', $expiration_date);
            $stmt->bindParam(':img', $imgFilename);
            // Bind the branch_id value, which can be null
            $stmt->bindParam(':branch_id', $branch_id, PDO::PARAM_INT);
            $stmt->execute();

            $returnValue = [
                'status' => $stmt->rowCount() > 0 ? 1 : 0,
                'message' => $stmt->rowCount() > 0 ? 'Product added successfully' : 'Failed to add product'
            ];
        } catch (PDOException $e) {
            $returnValue = [
                'status' => 0,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }

        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
    function getProduct($json = null)
    {
        include 'connect.php';

        $sql = "SELECT 
            *
        FROM tblproduct
        ORDER BY product";

        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

            error_log("Fetched branch data: " . json_encode($returnValue));

            return json_encode($returnValue);
        } catch (PDOException $e) {
            error_log("Error fetching branch data: " . $e->getMessage());
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

$login = new Add();
switch ($operation) {
    case "getUsers":
        echo $login->getUsers($json);
        break;
    case "getStatus":
        echo $login->getStatus($json);
        break;
    case "getRole":
        echo $login->getRole($json);
        break;
    case "user":
        echo $login->user($json);
        break;
    case "updateUserStatus":
        echo $login->updateUserStatus($json);
        break;
    case "getBranch":
        echo $login->getBranch($json);
        break;
    case "updateBranchStatus":
        echo $login->updateBranchStatus($json);
        break;
    case "addBranch":
        echo $login->addBranch($json);
        break;
    case "addProduct":
        echo $login->addProduct($json);
        break;
    case "getProduct":
        echo $login->getProduct($json);
        break;
}
