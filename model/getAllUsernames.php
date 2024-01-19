<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get every usernames on the db except for the logged one */

$sql = "SELECT username
        FROM cm_user
        WHERE username != ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $_POST['loggedUser']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
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