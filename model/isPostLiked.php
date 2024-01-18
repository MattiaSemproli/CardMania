<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Return if a user already likes a specific post */

$sql = "SELECT *
        FROM cm_like
        WHERE username = ? AND id_post = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_GET['username'], $_GET['postID']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $temp = array(
                "liked" => true,
            );
            echo json_encode($temp);
        } else {
            $temp = array(
                "liked" => false,
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