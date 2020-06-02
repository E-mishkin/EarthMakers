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

        /*
        if (!isset($_SESSION['userID'])) { // must be logged in
            $this->_f3->reroute('/home');
        }
        */

        // TODO: When login works, replace 0 with teacher ID
        $classes = $this->_db->getClassCodes(1);

        var_dump($classes);

        $this->_f3->set('classes', $classes);


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