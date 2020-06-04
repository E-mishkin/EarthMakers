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
            var_dump($_POST);

            if($_POST['formType'] == 'adminLogin'){
                $username = $_POST['adminUser'];
                $password= $_POST['adminPassword'];
                $password = md5($password);


                $id = $this->_db->validateTeacherLogin($username, $password)['teacherID'];

                $_SESSION['userID'] = $id;

                if (!$id) { // if not validated
                    echo "no";
                } else {
                    $_SESSION['userID'] = $id;
                    $_SESSION['userType'] = 'admin';
                    $name = $this->_db->getTeacherName($id);
                    $name = $name['fName'].' '.$name['lName'];
                    $_SESSION['name'] = $name;

                    //Redirect to page 1
                    $this->_f3->reroute('/admin');
                }


            } else if($_POST['formType'] == 'studentLogin'){

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


        if (!isset($_SESSION['userID'])) { // must be logged in
            $this->_f3->reroute('/home');
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
        $view = new Template();
        echo $view->render('controller/logout.php');

    }


}