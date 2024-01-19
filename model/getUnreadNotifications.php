<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Check if a new notification has shown up */

$sql = "SELECT sender, 
               recipient,
               _datetime,
               state
        FROM cm_notification
        WHERE recipient = ? AND state = 0";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_POST['username']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            echo $result->num_rows;
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