CREATE DATABASE dbcardmania;

CREATE USER 'secure_user'@'localhost' IDENTIFIED BY 'M1kank%B3stD3ck';
GRANT SELECT, INSERT, UPDATE, DELETE ON dbcardmania.* TO 'secure_user'@'localhost';


CREATE TABLE cm_user(
    username VARCHAR(30) NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(25) NOT NULL,
    profile_picture LONGBLOB,
    bio TEXT,
    pssw CHAR(128) NOT NULL,
    salt CHAR(128) NOT NULL
);

CREATE TABLE cm_post(
    id_post INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    _date DATE NOT NULL
    photo LONGBLOB NOT NULL,
    FOREIGN KEY (username) REFERENCES cm_user(username)
);

CREATE TABLE cm_comment(
    id_comment INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_post INT NOT NULL,
    username VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    _datetime DATETIME NOT NULL,
    FOREIGN KEY (id_post) REFERENCES cm_post(id_post),
    FOREIGN KEY (username) REFERENCES cm_user(username)
);

CREATE TABLE login_attempt(
    username VARCHAR(30) NOT NULL,
    _time DATETIME NOT NULL
);

CREATE TABLE cm_follow(
    username VARCHAR(30) NOT NULL,
    follower VARCHAR(30) NOT NULL,
    _date DATE,
    PRIMARY KEY (username, follower)
);

CREATE TABLE cm_notification(
    id_notification INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(30) NOT NULL,
    recipient VARCHAR(30) NOT NULL,
    id_post INT,
    _datetime DATETIME,
    type VARCHAR(15),
    state TINYINT(1) DEFAULT 0,
    FOREIGN KEY (sender) REFERENCES cm_user(username),
    FOREIGN KEY (recipient) REFERENCES cm_user(username),
    FOREIGN KEY (id_post) REFERENCES cm_post(id_post),
    FOREIGN KEY (type) REFERENCES cm_notification_type(type)
);

CREATE TABLE cm_notification_type(
    type VARCHAR(15) NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
);

CREATE TABLE cm_like(
    username VARCHAR(30) NOT NULL,
    id_post INT NOT NULL,
    PRIMARY KEY (username, id_post)
);