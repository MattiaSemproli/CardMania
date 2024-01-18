<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Remove a like to a specific post */

$sql = "DELETE FROM cm_like WHERE username = ? AND id_post = ?";

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
