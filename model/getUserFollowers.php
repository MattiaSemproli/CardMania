<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get number of followers or followers list of a user */

if(isset($_GET['nFollowers'])) {
    $request = $_GET['nFollowers'];
    $sql = "SELECT COUNT(follower) AS nFollowers
            FROM cm_follow
            WHERE username = ?";
} else if(isset($_GET['followers'])) {
    $request = $_GET['followers'];
    $sql = "SELECT follower
            FROM cm_follow
            WHERE username = ?";
} else {
    exit();
}

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $request);
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