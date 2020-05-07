<?php


$user = posix_getpwuid(posix_getuid());
$userDir = $user['dir'];
require_once ("$userDir/config.php");

class SeismicDatabase
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


    function getClassCodes()
    {
        $sql = "SELECT ClassCode, ClassName from Classes";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }

    function getAllStudents()
    {
        $sql = "SELECT * from Students";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters

        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result; // the result can contain info for admin status should it be needed.
    }


    function validateTeacherLogin($username, $password)
    {
        $sql = "SELECT UserName, Password, TeacherID, isAdmin from Teachers where UserName = :username and Password = :password";

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
        $sql = "SELECT FName, LName from Teachers where TeacherID = :id";

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
        $sql = "SELECT FName, LName from Students where StudentID = :id";

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
        $sql = "SELECT isAdmin from Teachers where TeacherID = :id";

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



    private function newTeacher($user/*, $userId*/)
    {
        $fname = $user->getFname();
        $lname = $user->getLname();
        $u_name = $user->getUname();
        $password = $user->getPassword();


        //insert into user next

        //1. Define the query

        $sql = "insert into users values (null, :fname , :lname, :username, :password, false, now());";

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

    private function newStudent($student)
    {

        $class = $student->getClass();
        $fname = $student->getFname();
        $lname = $student->getLname();
        $password = $student->getPassword();


        //insert into user next

        //1. Define the query

        $sql = "insert into users values (null, :class, :fname , :lname, 0, now(), false, null);";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':class', $class);
        $statement->bindParam(':fname', $fname);
        $statement->bindParam(':lname', $lname);
        $statement->bindParam(':password', $password);


        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $userId = $this->_dbh->lastInsertId();

    }

    private function updateStudent($success/*, $userId*/)
    {
        //insert into user next

        //1. Define the query

        $sql = "UPDATE `Students` SET `is_admin`= :admin WHERE StudentID = :id";

        //2. Prepare the statement
        $statement = $this->_dbh->prepare($sql);

        //3. Bind the parameters
        //$statement->bindParam(':userId', $userId);
        $statement->bindParam(':class', $class);
        $statement->bindParam(':fname', $fname);
        $statement->bindParam(':lname', $lname);
        $statement->bindParam(':password', $password);


        //4. Execute the statement
        $statement->execute();

        //5. Get the result
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        return $result;

    }

}

