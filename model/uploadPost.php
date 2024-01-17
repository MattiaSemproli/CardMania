<?php

require_once('connection/conn.php');

$query = "INSERT INTO cm_post(username, description, _date, photo) VALUES (?, ?, CURRENT_TIMESTAMP(), ?)";

if ($insert = $conn->prepare($query)) {
    $image = NULL;
    /*  */
    $insert->bind_param('ssb', $_POST['username'], $_POST['description'], $image);
    if($_FILES['photo']['error'] == 0){
        $insert->send_long_data(2,file_get_contents($_FILES['photo']['tmp_name']));
    }
    if ($insert->execute()) {
        $response = array("success" => true);
        echo json_encode($response);
    } else {
        $response = array("error" => $insert->error);
        echo json_encode($response);
    }
}
    
$conn->close();

?>