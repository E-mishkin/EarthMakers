<?php

//Turn on error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

//If the user is already logged in
if (isset($_SESSION['username'])) {
    //Redirect to page 1
    header('location: summary');
}

//If the login form has been submitted
if(isset($_POST['submit'])) {
    //Include creds.php (eventually, passwords should be moved to a secure location
    //or stored in a database)
    include('controller/creds.php');

    //Get the username and password from the POST array
    $username = $_POST["username"];
    $password = $_POST["password"];

    //If the username and password are correct
    if (array_key_exists($username, $login) && $login["$username"] == $password) {
        //Store login name in a session variable
        $_SESSION['username'] = $username;

        //Redirect to page 1
        header('location: summary');
    }

    //Login credentials are incorrect
    // echo '<script language="javascript">';
    // echo 'alert("Invalid username/password")';
    // echo '</script>';

    echo "<p>Invalid username/password</p>";
}