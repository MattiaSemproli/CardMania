<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Return if a user follows or not another user */

$sql = "SELECT *
        FROM cm_follow
        WHERE username = ? AND follower = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_GET['targetUser'], $_GET['follower']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $temp = array(
                "follows" => true,
            );
            echo json_encode($temp);
        } else {
            $temp = array(
                "follows" => false,
            );
            echo json_encode($temp);
        }
    } else {
        echo json_encode(array("error" => $stmt->error));
    }
} else {
    echo json_encode(array("error" => $stmt->error));
}

$conn->close();

?>