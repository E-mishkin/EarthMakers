<?php

//Start the session
//session_start();

//If user is logged in, get username
if (isset($_SESSION['username'])) {

    //Display a welcome message
    echo '<a href="logout" style="color: white; background-color: darkblue; float: right" 
    class="btn btn-default float-right">Logout</a>';

    //Display a logout link
    //echo '<a href="logout.php">logout</a>';

}
