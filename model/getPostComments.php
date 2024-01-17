<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get every comments of a specific post */

$sql = "SELECT username,
               content,
               _datetime
        FROM cm_comment
        WHERE id_post = ?
        ORDER BY _datetime DESC";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_GET['postID']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows >= 0) {
            $temp = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($temp);
        } else {
            echo json_encode(array());
        }
    } else {
        echo json_encode(array("error" => $stmt->error));
    }
} else {
    echo json_encode(array("error" => $stmt->error));
}

$conn->close();

?>