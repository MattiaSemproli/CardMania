<?php

require_once('/connection/conn.php');

$targetUser = $_POST['username'];

$sql = "SELECT p.id_post AS n,
               u.name,
               p.description,
               p._date,
               p.photo
        FROM cm_post AS p
        INNER JOIN cm_user AS u
        ON p.username = u.username
        WHERE p.username = '$targetUser'
        ORDER BY n DESC";

session_start();
if ($stmt = $conn->prepare($sql)) {
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows >= 1) {
            $temp = $result->fetch_all(MYSQLI_ASSOC);
            for ($i = 0; $i < count($temp); $i++) {
                $temp[$i]['photo'] = base64_encode($temp[$i]['photo']);
            }
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