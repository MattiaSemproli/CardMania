<?php

$conn = new mysqli("localhost", "secure_user", "M1kank%B3stD3ck", "dbcardmania", 3306);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>