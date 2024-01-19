<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Add a like to a specific post */

$sql = "INSERT INTO cm_like(username, id_post) VALUES (?, ?)";

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

$getPostOwner = "SELECT username FROM cm_post WHERE id_post = ?";
if ($getPO = $conn->prepare($getPostOwner)) {
    $getPO->bind_param("s", $_POST['postID']);
    if ($getPO->execute()) {
        $result = $getPO->get_result();
        $temp = $result->fetch_all(MYSQLI_ASSOC);
        $postOwner = $temp[0]['username'];
        if ($postOwner != $_POST['username']) {
            $notification = "INSERT INTO cm_notification(sender, recipient, id_post, _datetime, type) 
                             VALUES (?, ?, ?, CURRENT_TIMESTAMP(), 'Like')";
            if ($insertNotification = $conn->prepare($notification)) {
                $insertNotification->bind_param("sss", $_POST['username'], $postOwner, $_POST['postID']);
                $insertNotification->execute();
            } else {
                echo json_encode(array("error" => $insertNotification->error));
            }
        }        
    } else {
        echo json_encode(array("error" => $stmt->error));
    }
} else {
    echo json_encode(array("error" => $stmt->error));
}

$conn->close();

?>