DROP TABLE IF EXISTS Teachers;
CREATE TABLE IF NOT EXISTS `Teachers` (
  `teacherID` INT NOT NULL AUTO_INCREMENT primary key,
  `fName` VARCHAR(45) NOT NULL,
  `lName` VARCHAR(45) NOT NULL,
  `userName` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `isAdmin` TINYINT(2) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

insert into Teachers values (null, 'test', 'admin', 'test', 'test', TRUE, now());
insert into Teachers values (null, 'test2', 'admin2', 'test2', 'test2', TRUE, now());


DROP TABLE IF EXISTS Classes;
CREATE TABLE IF NOT EXISTS `Classes` (
  `classCode` VARCHAR(10) NOT NULL primary key,
  `className` VARCHAR(45) NOT NULL,
  `teacherID` VARCHAR(45) NOT NULL
);

insert into Classes values ('test1', 'test class2', 0);
insert into Classes values ('test123', 'test class', 1);



DROP TABLE IF EXISTS `Students`;
CREATE TABLE IF NOT EXISTS `Students` (
  `studentID` INT NOT NULL AUTO_INCREMENT primary key,
  `classCode` VARCHAR(10) NOT NULL,
  `fName` VARCHAR(45) NOT NULL,
  `lName` VARCHAR(45) NOT NULL,
  `attempts` INT(10) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `success` TINYINT(2) NOT NULL,
  `timeOfSuccess` datetime ON UPDATE CURRENT_TIMESTAMP
);

insert into Students values (null, 'test123', 'test', 'student', 2, now(), false, null);
insert into Students values (null, 'test123', 'test2', 'student', 2, now(), true, now());