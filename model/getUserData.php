<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get name, bio and profile picture of the targetUser */

$sql = "SELECT name,
               profile_picture AS photo,
               bio
        FROM cm_user
        WHERE username = ?
        LIMIT 1";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_GET['targetUser']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows == 1) {
            $temp = $result->fetch_all(MYSQLI_ASSOC);
            $temp[0]['photo'] = base64_encode($temp[0]['photo']);
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