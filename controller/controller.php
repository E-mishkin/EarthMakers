<?php

class controller
{

    private $_f3;
    private $_db; // database

    /**
     * Controller constructor.
     * @param $f3
     */
    public function __construct($f3, $db)
    {
        $this->_f3 = $f3;
        $this->_db = $db;
    }


    /**
     * Home page route
     */
    public function home()
    {
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            //var_dump($_POST);

            $adminLogin = false;

            $username = $_POST['user'];
            $password= $_POST['password'];

            if(preg_match('/[0-9]{9}/', $username)) {  // if password is a student id number
                $id = $this->_db->validateStudentLogin($username, $password)['studentID'];


                if (!$id) { // if not validated
                    echo "no";
                } else {
                    $_SESSION['userID'] = $id;
                    $_SESSION['user'] = "student";


                    //Redirect to page 1
                    $this->_f3->reroute('/simulator');
                }

            }
            else{
                $password = md5($password);
                //echo("<pre>");
                //echo($password);
                //echo("</pre>");

                $id = $this->_db->validateTeacherLogin($username, $password)['teacherID'];

                if (!$id) { // if not validated
                    echo "no";
                } else {
                    $_SESSION['userID'] = $id;
                    $_SESSION['user'] = "teacher";
                    $name = $this->_db->getTeacherName($id);
                    $name = $name['fName'].' '.$name['lName'];
                    $_SESSION['name'] = $name;

                    //Redirect to page 1
                    $this->_f3->reroute('/admin');
                }


            }

        }

        if (isset($_SESSION['userID'])) {
            $this->_f3->reroute('/simulator');
        }


        $view = new Template();
        echo $view->render('views/home.html');
    }

    /**
     * simulator page route
     */
    public function simulator()
    {
        $view = new Template();
        echo $view->render('views/simulator.html');
    }

    /**
     * Admin page route
     */
    public function admin()
    {
        // TODO: Teacher Login gets and stores teacher's id for use in admin page


        if ($_SESSION['user'] != 'teacher') { // must be logged in
            $this->_f3->reroute('/earthMakers');
        }

        // TODO: When login works, replace 0 with teacher ID
        $classes = $this->_db->getClassCodes($_SESSION['userID']);

        if(isset($_GET['classCode'])){
            $students = $this->_db->getClassStudents($_GET['classCode']);
        } else {
            $students = null;
        }



        //var_dump($classes);

        $this->_f3->set('classes', $classes);
        $this->_f3->set('students', $students);

        //echo"<pre>";
        //var_dump($students);
        //echo"</pre>";


        $view = new Template();
        echo $view->render('views/admin.html');
    }

    /**
     * Student page route
     */
    public function student()
    {
        $view = new Template();
        echo $view->render('views/student.html');
    }

    /**
     * summary page route
     */
    public function summary()
    {
        $view = new Template();
        echo $view->render('views/summary.html');
    }


    /**
     * logout route
     */
    public function logout()
    {
        //this will wipe everything
        $_SESSION = array();
        session_destroy();

        $this->_f3->reroute('/earthMakers');
    }
}