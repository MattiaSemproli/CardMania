<?php

// /* Require connection to db */
// require_once('connection/conn.php');

// /* Edit logged user profile */

// $sql = "UPDATE cm_user SET name = ?, surname = ?, email = ?, password = ? WHERE username = ?";

// if ($stmt = $conn->prepare($sql)) {
//     $stmt->bind_param("ss", $_POST['username'], $_POST['postID']);
//     if ($stmt->execute()) {
//         $temp = array(
//             "ok" => true,
//         );
//         echo json_encode($temp);
//     } else {
//         echo json_encode(array("error" => $stmt->error));
//     }
// } else {
//     echo json_encode(array("error" => $stmt->error));
// }

// $conn->close();

?>