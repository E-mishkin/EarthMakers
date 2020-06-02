<?php

class controller
{

    private $_f3;

    /**
     * Controller constructor.
     * @param $f3
     */
    public function __construct($f3)
    {
        $this->_f3 = $f3;
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