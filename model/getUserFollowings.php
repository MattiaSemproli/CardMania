<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Get number of followings or followings list of a user */

if(isset($_GET['nFollowings'])) {
    $request = $_GET['nFollowings'];
    $sql = "SELECT COUNT(username) AS nFollowings
            FROM cm_follow
            WHERE follower = ?";
} else if(isset($_GET['followings'])) {
    $request = $_GET['followings'];
    $sql = "SELECT username
            FROM cm_follow
            WHERE follower = ?";
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