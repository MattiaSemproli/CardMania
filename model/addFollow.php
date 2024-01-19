<?php

/* Require connection to db */
require_once('connection/conn.php');

/* The logged user starts following a user */

$sql = "INSERT INTO cm_follow(username, follower, _date) VALUES (?, ?, CURRENT_TIMESTAMP())";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_POST['targetUser'], $_POST['loggedUser']);
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

$notification = "INSERT INTO cm_notification(sender, recipient, id_post, _datetime, type) 
                    VALUES (?, ?, NULL, CURRENT_TIMESTAMP(), 'Follow')";
if ($insertNotification = $conn->prepare($notification)) {
    $insertNotification->bind_param("ss", $_POST['loggedUser'], $_POST['targetUser']);
    $insertNotification->execute();
} else {
    echo json_encode(array("error" => $insertNotification->error));
}

$conn->close();

?>