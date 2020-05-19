DROP TABLE IF EXISTS Teachers;
CREATE TABLE IF NOT EXISTS `Teachers` (
  `TeacherID` INT NOT NULL AUTO_INCREMENT primary key,
  `FName` VARCHAR(45) NOT NULL,
  `LName` VARCHAR(45) NOT NULL,
  `UserName` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `isAdmin` TINYINT(2) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

insert into Teachers values (null, 'admin', 'admin', 'admin', 'admin', TRUE, now());

DROP TABLE IF EXISTS `Students`;
CREATE TABLE IF NOT EXISTS `Students` (
  `StudentID` INT NOT NULL AUTO_INCREMENT primary key,
  `Class Code` VARCHAR(10) NOT NULL,
  `FName` VARCHAR(45) NOT NULL,
  `LName` VARCHAR(45) NOT NULL,
  `Attempts` INT(10) NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Success` TINYINT(2) NULL,
  `timeOfSuccess` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Classes;
CREATE TABLE IF NOT EXISTS `Classes` (
  `ClassCode` VARCHAR(5) NOT NULL primary key,
  `ClassName` VARCHAR(45) NOT NULL,
  `TeacherID` VARCHAR(45) NOT NULL
);