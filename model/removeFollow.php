<?php

/* Require connection to db */
require_once('connection/conn.php');

/* The logged user stops following a user */

$sql = "DELETE FROM cm_follow WHERE username = ? AND follower = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_GET['targetUser'], $_GET['loggedUser']);
    if ($stmt->execute()) {
        $temp = array(
            "unfollows" => true,
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