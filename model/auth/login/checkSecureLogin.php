<?php

function executeLogin($username, $password, $connection) {
    $resUsername = "";
    $resPassword = "";
    $resSalt = "";
    $sql = "SELECT username, pssw, salt FROM cm_user WHERE username = ? LIMIT 1";
    if ($stmt = $connection->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($resUsername, $resPassword, $resSalt);
        $stmt->fetch();
        $password = hash('sha512', $password . $resSalt);
        if ($stmt->num_rows == 1) {
            if (testBruteForce($resUsername, $connection)) {
                return false;
            } else {
                if ($resPassword == $password) {
                    $userBrowser = $_SERVER['HTTP_USER_AGENT'];
                    $resUsername = preg_replace("/[^0-9]+/", "", $resUsername);
                    $_SESSION['username'] = $resUsername;
                    $_SESSION['login_string'] = hash('sha512', $password . $userBrowser);
                    return true;
                } else {
                    $sql = "INSERT INTO login_attempt (username, _time) VALUES ('$resUsername', CURRENT_TIMESTAMP())";
                    $connection->query($sql);
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkLogin($connection) {
    if (isset($_SESSION['username'], $_SESSION['login_string'])) {
        $username = $_SESSION['username'];
        $loginString = $_SESSION['login_string'];
        $userBrowser = $_SERVER['HTTP_USER_AGENT'];
        $sql = "SELECT pssw FROM cm_user WHERE username = ? LIMIT 1";
        if ($stmt = $connection->prepare($sql)) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows == 1) {
                $password = "";
                $stmt->bind_result($password);
                $stmt->fetch();
                $loginCheck = hash('sha512', $password . $userBrowser);
                if ($loginCheck == $loginString) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function testBruteForce($username, $connection) {
    $now = time();
    $validAttempts = $now - (2 * 60 * 60);
    $sql = "SELECT _time FROM login_attempt WHERE username = ? AND _time > '$validAttempts'";
    if ($stmt = $connection->prepare($sql)) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}
