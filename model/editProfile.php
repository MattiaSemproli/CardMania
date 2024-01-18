<?php

/* Require connection to db */
require_once('connection/conn.php');

/* Edit logged user profile */

function updateValue($conn, $sql, $param, $isPicture) {
    if ($stmt = $conn->prepare($sql)) {
        if ($isPicture) {
            $pic = null;
            $stmt->bind_param("bs", $pic, $_POST['username']);
            $stmt->send_long_data(0, file_get_contents($_FILES['photo']['tmp_name']));
        } else {
            $stmt->bind_param("ss", $param, $_POST['username']);
        }
        $stmt->execute();
    } else {
        header("Location: ../view/user/profile.html");
    }
}

if (isset($_POST['nickname']) && $_POST['nickname'] != "") {
    $sqlName = "UPDATE cm_user 
                SET name = ? 
                WHERE username = ?";
    updateValue($conn, $sqlName, $_POST['nickname'], false);
} 
if (isset($_POST['bio']) && $_POST['bio'] != "") {
    $sqlBio = "UPDATE cm_user 
               SET bio = ?
               WHERE username = ?";
    updateValue($conn, $sqlBio, $_POST['bio'], false);
} 
if (isset($_FILES['photo']) && !empty($_FILES['photo']['tmp_name'] && $_FILES['photo']['error'] == 0)) {
    $sqlPicture = "UPDATE cm_user
                   SET profile_picture = ? 
                   WHERE username = ?";
    updateValue($conn, $sqlPicture, NULL, true);
}

header("Location: ../view/user/profile.html");


$conn->close();

?>