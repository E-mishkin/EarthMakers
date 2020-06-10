<?php


$user = posix_getpwuid(posix_getuid());
$userDir = $user['dir'];
require_once ("$userDir/SeismicConfig.php");

/**
 * Class seismicDatabase
 * This class contains useful functions utilizing the database
 */
class seismicDatabase
{
    //PDO object
    private $_dbh;

    function __construct()
    {
        try {
            // Create a new PDO connection
            $this->_dbh = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
            //echo "Connected";
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }


    /**
     * @param $teacherID int id of the teacher
     * @return mixed All classes and class codes listed in the database associated with the teacher
     */
    function getClassCodes($teacherID)
    {
        $sql = "SELECT * from Classes where teacherID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':id', $teacherID);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }

    /**
 * @return mixed Information from all students, will be used for a teacher
 */
    function getAllStudents()
    {
        $sql = "SELECT * from Students";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }


    /**
     * @param $classCode String code of class associated with student
     * @return mixed Information from all students, will be used for a teacher
     */
    function getClassStudents($classCode)
    {
        $sql = "SELECT * from Students where classCode = :code";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':code', $classCode);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }


    function validateTeacherLogin($username, $password)
    {
        $sql = "SELECT userName, password, teacherID, isAdmin from Teachers where userName = :username and password = :password";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':username', $username);
        $statement->bindParam(':password', $password);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }

    function validateStudentLogin($username, $password)
    {
        $sql = "SELECT studentID, classCode from Students where studentID = :username and classCode = :password";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':username', $username);
        $statement->bindParam(':password', $password);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }

    function getTeacherName($id)
    {
        $sql = "SELECT fName, lName from Teachers where teacherID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':id', $id);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    function getStudentName($id)
    {
        $sql = "SELECT fName, lName from Students where studentID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':id', $id);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }


    function isAdmin($id)
    {
        $sql = "SELECT isAdmin from Teachers where teacherID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        $statement->bindParam(':id', $id);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;
    }



    function newTeacher($user/*, $userId*/)
    {
        $fname = $user->getFname();
        $lname = $user->getLname();
        $u_name = $user->getUname();
        $password = $user->getPassword();


        //insert into user next

        //1. Define the query

        $sql = "insert into Teachers values (null, :fname , :lname, :username, :password, false, now());";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':fname', $fname);
        $statement->bindParam(':lname', $lname);
        $statement->bindParam(':username', $u_name);
        $statement->bindParam(':password', $password);


        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $userId = $this->_dbh->lastInsertId();

    }

    function newStudent($student)
    {

        $class = $student->getClass();
        $id = $student->getID();
        $password = $student->getPassword();

        $fname = null;
        $lname = null;


        //insert into user next

        //1. Define the query

        $sql = "insert into Students values (:id, :class, :fname, :lname, 0, now(), false, null);";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':class', $class);
        $statement->bindParam(':id', $id);

        $statement->bindParam(':password', $password);


        $statement->bindParam(':fname', $fname);
        $statement->bindParam(':fname', $lname);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $userId = $this->_dbh->lastInsertId();

    }

    function updateStudentSuccess($success, $userId)
    {
        //get student attempts
        $attempts = $this->getAttempts($userId)['attempts'];


        //1. Define the query

        $sql = "UPDATE `Students` SET `success`= :success, `attempts`=: attempts WHERE StudentID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':success', $success);

        $statement->bindParam(':attempts', $attempts);
        $statement->bindParam(':id', $userId);


        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;

    }

    private function getAttempts($userId)
    {
         //1. Define the query

        $sql = "SELECT attempts from Students where studentID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':id', $userId);

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;

    }

}

