<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Add a comment to a specific post */

$sql = "INSERT INTO cm_comment(id_post, username, content, _datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP())";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("sss", $_POST['postID'], $_POST['username'], $_POST['content']);
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