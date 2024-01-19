<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get all the notifications of a user */

$sql = "SELECT n.sender, 
               n.recipient,
               n._datetime,
               n.state,
               t.description
        FROM cm_notification AS n
        INNER JOIN cm_notification_type AS t 
        ON n.type = t.type
        WHERE n.recipient = ?
        ORDER BY n._datetime DESC";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_POST['username']);
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