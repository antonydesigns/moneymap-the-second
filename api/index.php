<?php

$allowed_origins = [
    'http://localhost:5173',
    'http://moneymap.test'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
}

include 'DbConnect.php';
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    header("Location: https://r.mtdv.me/secretkey123");
    die();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'));

    if ($data->meta == "load_txns") {
        $sql = "SELECT * FROM `transactions`";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($transactions);
        } else {
            echo json_encode("Failed to load accounts");
        }
    }


    if ($data->meta == "load_accounts") {
        $sql = "SELECT * FROM `accounts`";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($accounts);
        } else {
            echo json_encode("Failed to load accounts");
        }
    }

    if ($data->meta == "check_balances") {
        $sql = "SELECT `acc_id`,sum(`change`) as `balance` FROM `transactions` GROUP BY `acc_id`";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($transactions);
        } else {
            echo json_encode("Failed to load accounts");
        }
    }


    if ($data->meta == "new_account") {
        $sql = "INSERT INTO `accounts` (`acc_id`, `account`) VALUES(NULL, :newAccount)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':newAccount', $data->new_account);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
    }

    if ($data->meta == "input") {
        $sql = "INSERT INTO `transactions` (`acc_id`, `change`) VALUES(:account_id, :change)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':account_id', $data->acc_id);
        $stmt->bindParam(':change', $data->add);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record created successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
    }

}



