<?php

/* Require connection to db */
require_once('connection/conn.php');

/* The logged user starts following a user */

$sql = "INSERT INTO cm_follow(username, follower, _date) VALUES (?, ?, CURRENT_TIMESTAMP())";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_GET['targetUser'], $_GET['loggedUser']);
    if ($stmt->execute()) {
        $temp = array(
            "follows" => true,
        );
        echo json_encode($temp);
    } else {
        echo json_encode(array("error" => $stmt->error));
    }
} else {
    echo json_encode(array("error" => $stmt->error));
}

$conn->close();

?>