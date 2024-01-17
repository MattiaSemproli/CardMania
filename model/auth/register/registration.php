<?php

require_once("../../connection/conn.php");
include("../login/checkSecureLogin.php");

$password = $_POST["password"];
$rndSalt = hash("sha512", uniqid(mt_rand(1, mt_getrandmax()), true));
$hashedPassword = hash("sha512", $password . $rndSalt);

$sql = "INSERT INTO cm_user(username, email, name, profile_picture, bio, pssw, salt) VALUES (?, ?, ?, ?, ?, ?, ?)";

session_start();

if ($stmt = $conn->prepare($sql)) {
    $pfp = NULL;
    $bio = NULL;
    $stmt->bind_param("sssbsss", $_POST["username"], $_POST["email"], $_POST["name"], $pfp, $bio, $hashedPassword, $rndSalt);
    if ($stmt->execute()) {
        $response = array(
            "success" => true,
            "username" => $_POST['username']
        );
    } else {
        $response = array(
            "success" => false,
            "error" => $stmt->error
        );
    }
} else {
    $response = array(
        "success" => false,
        "error" => $conn->error
    );
}

$conn->close();

echo json_encode($response);

?>