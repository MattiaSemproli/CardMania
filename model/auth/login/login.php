<?php

require_once("../../connection/conn.php");
include("checkSecureLogin.php");

session_start();
if (isset($_POST['username']) && isset($_POST['password'])) {
    if (executeLogin($_POST['username'], $_POST['password'], $conn)) {
        $response = array(
            "success" => true,
            "username" => $_POST['username']
        );
    } else {
        $response = array(
            "success" => false,
            "error" => "Invalid username or password"
        );
    }
} else {
    $response = array(
        "success" => false,
        "error" => "Invalid username or password"
    );
}
$conn->close();

echo json_encode($response);

?>