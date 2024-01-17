-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 16, 2024 alle 14:57
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbcardmania`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_comment`
--

CREATE TABLE `cm_comment` (
  `id_comment` int(11) NOT NULL,
  `id_post` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `content` text NOT NULL,
  `_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_follow`
--

CREATE TABLE `cm_follow` (
  `following` varchar(30) NOT NULL,
  `follower` varchar(30) NOT NULL,
  `_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_like`
--

CREATE TABLE `cm_like` (
  `username` varchar(30) NOT NULL,
  `id_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_notification`
--

CREATE TABLE `cm_notification` (
  `id_notification` int(11) NOT NULL,
  `sender` varchar(30) NOT NULL,
  `recipient` varchar(30) NOT NULL,
  `id_post` int(11) DEFAULT NULL,
  `_datetime` datetime DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `state` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_notification_type`
--

CREATE TABLE `cm_notification_type` (
  `type` varchar(15) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `cm_notification_type`
--

INSERT INTO `cm_notification_type` (`type`, `description`) VALUES
('Comment', 'commented on one of your post.'),
('Follow', 'started following you.'),
('Like', 'liked your post.'),
('Message', 'sent you a private message.');

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_post`
--

CREATE TABLE `cm_post` (
  `id_post` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `_date` date NOT NULL,
  `photo` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_private_message`
--

CREATE TABLE `cm_private_message` (
  `writer` varchar(30) NOT NULL,
  `receiver` varchar(30) NOT NULL,
  `_datetime` datetime NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cm_user`
--

CREATE TABLE `cm_user` (
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(25) NOT NULL,
  `profile_picture` longblob DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `pssw` char(128) NOT NULL,
  `salt` char(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `login_attempt`
--

CREATE TABLE `login_attempt` (
  `username` varchar(30) NOT NULL,
  `_time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `cm_comment`
--
ALTER TABLE `cm_comment`
  ADD PRIMARY KEY (`id_comment`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `username` (`username`);

--
-- Indici per le tabelle `cm_follow`
--
ALTER TABLE `cm_follow`
  ADD PRIMARY KEY (`following`,`follower`);

--
-- Indici per le tabelle `cm_like`
--
ALTER TABLE `cm_like`
  ADD PRIMARY KEY (`username`,`id_post`);

--
-- Indici per le tabelle `cm_notification`
--
ALTER TABLE `cm_notification`
  ADD PRIMARY KEY (`id_notification`),
  ADD KEY `sender` (`sender`),
  ADD KEY `recipient` (`recipient`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `type` (`type`);

--
-- Indici per le tabelle `cm_notification_type`
--
ALTER TABLE `cm_notification_type`
  ADD PRIMARY KEY (`type`);

--
-- Indici per le tabelle `cm_post`
--
ALTER TABLE `cm_post`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `username` (`username`);

--
-- Indici per le tabelle `cm_private_message`
--
ALTER TABLE `cm_private_message`
  ADD PRIMARY KEY (`writer`,`receiver`);

--
-- Indici per le tabelle `cm_user`
--
ALTER TABLE `cm_user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `cm_comment`
--
ALTER TABLE `cm_comment`
  MODIFY `id_comment` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cm_notification`
--
ALTER TABLE `cm_notification`
  MODIFY `id_notification` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `cm_post`
--
ALTER TABLE `cm_post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `cm_comment`
--
ALTER TABLE `cm_comment`
  ADD CONSTRAINT `cm_comment_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `cm_post` (`id_post`),
  ADD CONSTRAINT `cm_comment_ibfk_2` FOREIGN KEY (`username`) REFERENCES `cm_user` (`username`);

--
-- Limiti per la tabella `cm_notification`
--
ALTER TABLE `cm_notification`
  ADD CONSTRAINT `cm_notification_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `cm_user` (`username`),
  ADD CONSTRAINT `cm_notification_ibfk_2` FOREIGN KEY (`recipient`) REFERENCES `cm_user` (`username`),
  ADD CONSTRAINT `cm_notification_ibfk_3` FOREIGN KEY (`id_post`) REFERENCES `cm_post` (`id_post`),
  ADD CONSTRAINT `cm_notification_ibfk_4` FOREIGN KEY (`type`) REFERENCES `cm_notification_type` (`type`);

--
-- Limiti per la tabella `cm_post`
--
ALTER TABLE `cm_post`
  ADD CONSTRAINT `cm_post_ibfk_1` FOREIGN KEY (`username`) REFERENCES `cm_user` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
