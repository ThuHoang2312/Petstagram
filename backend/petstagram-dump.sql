-- MySQL dump 10.13  Distrib 8.0.30, for macos12.4 (x86_64)
--
-- Host: localhost    Database: petstagram_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `photo_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `photo_id` (`photo_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (15,'hi','2022-12-12 14:09:40',17,9),(19,'i like your photo','2022-12-12 18:32:26',10,15),(20,'You dog is so cute!','2022-12-13 10:43:46',15,14);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `follower_id` int NOT NULL,
  `followee_id` int NOT NULL,
  PRIMARY KEY (`follower_id`,`followee_id`),
  KEY `followee_id` (`followee_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followee_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (13,9),(14,9),(14,13);
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `photo_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`photo_id`),
  KEY `photo_id` (`photo_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`photo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (9,14),(14,15),(13,16),(9,17),(14,23),(14,24);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `photo_id` int NOT NULL AUTO_INCREMENT,
  `filename` text NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `coords` text,
  PRIMARY KEY (`photo_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (10,'b57dec6f4b934ebb1182e5d1b776ed8c','testing 2',NULL,9,'[24.84575,60.258116666666666]'),(13,'5ff700e6cefac1d9a3a6b7a86d959105','testing','2022-12-08 13:18:43',9,NULL),(14,'a9ae12597052d47f5b4cbe749fc9792a','My cat','2022-12-09 09:52:32',13,NULL),(15,'056275f410245750bdbacda5c9333bbe','hello','2022-12-09 10:33:41',9,NULL),(16,'c3c686273bd66e53ad6cf10276346ffd','my lovely dog','2022-12-12 07:23:17',9,NULL),(17,'14869e9a374bb896cf476fc14dd2627e','cute bird','2022-12-12 14:06:40',9,NULL),(19,'bc1d124527c5e053590843c3216d4a33','my rabbit','2022-12-12 18:02:04',14,NULL),(20,'6a16e4ba102839d832c7392a7f906b8e','my love','2022-12-12 18:02:32',14,NULL),(21,'d5def968bf3191c45c80790244268488','my view','2022-12-12 18:04:52',14,'[24.84575,60.258116666666666]'),(23,'4fc1f857e80d26f21919418e9541bc8a','hi','2022-12-12 18:16:23',13,NULL),(24,'88db2c9e6684a4c38db033cdde49a6aa','hi','2022-12-12 18:25:00',13,NULL),(25,'7cc8aa9b0252689871350c6f9feb672f','testing','2022-12-12 18:26:45',13,NULL),(26,'43481389fff6d0ab751d1f8c15940509','testing','2022-12-13 08:49:08',18,NULL),(27,'4e580751d08c395080058aaaae4a75b6','edited','2022-12-13 13:07:30',20,NULL);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `avatar` text,
  `description` text,
  `role` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'Thu Minh Hoang','thu@gmail.com','$2b$10$UHT/YLiYNHM1i4pmyqb/uOx4hELv84XXrZAbarGnO0QqS6KZ9Wer6','448bdb5efbc27e883dac66d862bfef7a','I love pets',1),(13,'thu2','thu2@gmail.com','$2b$10$6c9dVs6FnkxCt7A589Sx0.iKdUY1vTSsbNsaXY1Lvxmv6aLRpnv9i',NULL,NULL,1),(14,'thuhoang1','thu1@gmail.com','$2b$10$NlZeeamQAQQp4MQ.OJVg2.kp4DPTzmlMz0dVrf8UyZoGfcDOkb1n.','82ee11af4ff626a71c7d141ffd1d7512','hi',1),(15,'thuh3','thu3@gmail.com','$2b$10$ZCiyLqfz0rDgkrbN4/TzLOkyGkoV89mae/u3VT.izYfN1d7aZKKCS',NULL,NULL,1),(16,'thuh4','thu4@gmail.com','$2b$10$MvzMuxUjgMUsFMwHjsC4GeERJL/LgVFTO7u49ysWXd/JkI.sbKrbO',NULL,NULL,1),(18,'thuAdmin','thuadmin@gmail.com','$2b$10$xb8LoGyoedhtDlxaleGjZuaHg0S1hZsTLJbs0r8bZ12YJ/WhJWidy',NULL,NULL,0),(19,'chiAdmin','chiadmin@gmail.com','$2b$10$9SK0hFRiE0YwzjjLF0ZU8u8WpCO.Ok3Lj4Eyl8mFwAUH0eXki/cmO','9c8fb1aee920f678008e177b4ddf30e9','I am an admin',0),(20,'thuh5','thu5@gmail.com','$2b$10$fN6KZKF56F44qpskibMguedTsMk81L9ARjK1faS8TSusDZQkqSebi','33eae96f642a439c40c584e421f67bef','hi',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-13 15:08:54
