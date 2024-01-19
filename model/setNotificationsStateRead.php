<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Set all notifications to read state */

$sql = "UPDATE cm_notification SET state = 1 WHERE recipient = ? AND state = 0";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
} else {
    echo json_encode(array("error" => $stmt->error));
}

$conn->close();

?>