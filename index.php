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

//Create database class
$db = new seismicDatabase();

//Turn on Fat-Free error reporting
$f3->set('DEBUG', 3);

$controller = new controller($f3, $db);

//Define a default home route

$f3->route('GET|POST /', function () {
    $GLOBALS['controller']->home();
});

//Define a home route to work with navbar
$f3->route('GET|POST /earthMakers', function (){
    $GLOBALS['controller']->home();
});

/*//Define a second home route
$f3->route('GET|POST /home', function (){
    $GLOBALS['controller']->home();
});*/

//Define a admin login route
$f3->route('GET|POST /simulator', function (){
    $GLOBALS['controller']->simulator();
});

//Define a admin login route
$f3->route('GET|POST /admin', function (){
      $GLOBALS['controller']->admin();
});

////Define a Student login route
$f3->route('GET|POST /student', function (){
      $GLOBALS['controller']->student();
});

////Define a Summary route
$f3->route('GET /summary', function (){
      $GLOBALS['controller']->summary();
});


//Define a logout route
$f3->route('GET|POST /logout', function (){
      $GLOBALS['controller']->logout();
});

//Run fat free

$f3->run();