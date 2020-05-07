<?php

// Turn on error reporting - this is critical!
ini_set('display_errors', 1);
error_reporting(E_ALL);

//Require the autoload file
require_once('vendor/autoload.php');

//Start a session
session_start();

//Create an instance of the base class
$f3 = Base::instance();

//Turn on Fat-Free error reporting
$f3->set('DEBUG', 3);

$controller = new controller($f3);

//Define a default home route
$f3->route('GET /', function (){
//    $view = new Template();
//    echo $view->render('views/home.html');
      $GLOBALS['controller']->home();
});

//Define a admin login route
$f3->route('GET|POST /admin', function (){
//    $view = new Template();
//    echo $view->render('views/admin.html');
      $GLOBALS['controller']->admin();
});

////Define a Student login route
$f3->route('GET|POST /student', function (){
//    $view = new Template();
//    echo $view->render('views/studentLogin.php');
      $GLOBALS['controller']->student();
});

////Define a Summary route
$f3->route('GET /summary', function ($f3){

//    $view = new Template();
//    echo $view->render('views/summary.html');
      $GLOBALS['controller']->summary();
});

//Define a logout route
$f3->route('GET|POST /logout', function (){

//    $view = new Template();
//    echo $view->render('controller/logout.php');
      $GLOBALS['controller']->logout();
});

//Run fat free
$f3->run();