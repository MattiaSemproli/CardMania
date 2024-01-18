<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Add a like to a specific post */

$sql = "INSERT INTO cm_like(username, id_post) VALUES (?, ?)";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("ss", $_POST['username'], $_POST['postID']);
    if ($stmt->execute()) {
        $temp = array(
            "ok" => true,
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