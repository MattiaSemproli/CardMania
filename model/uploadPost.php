<?php

require_once('connection/conn.php');

$query = "INSERT INTO cm_post(username, description, _date, photo) VALUES (?, ?, CURRENT_TIMESTAMP(), ?)";

if ($stmt = $conn->prepare($query)) {
    $image = NULL;
    $stmt->bind_param('ssb', $_POST['username'], $_POST['description'], $image);
    if($_FILES['photo']['error'] == 0){
        $stmt->send_long_data(2,file_get_contents($_FILES['photo']['tmp_name']));
    } else {
        header("Location: ../view/user/upload.html");
    }
    if ($stmt->execute()) {
        $response = array("success" => true);
        header("Location: ../view/feed/index.html");
    } else {
        $response = array("error" => $stmt->error);
        header("Location: ../view/user/upload.html");
    }
}
    
$conn->close();

?>