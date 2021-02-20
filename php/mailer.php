<?php

## CONFIG ##

# LIST EMAIL ADDRESS
$recipient = "erik.bervoets10@gmail.com";
$sender = "webmaster@berretti.be";
# SUBJECT (Subscribe/Remove)
$subject = "Contact formulier Berretti.be";

# RESULT PAGE
$location = $_POST['page'];
$destination = strtolower($location);

## FORM VALUES ##

# SENDER - WE ALSO USE THE RECIPIENT AS SENDER IN THIS SAMPLE
# DON'T INCLUDE UNFILTERED USER INPUT IN THE MAIL HEADER!


# MAIL BODY
$body .= "Name: ".$_POST['name']." \n";
$body .= "E-mail: ".$_POST['email']." \n";
$body .= "Bericht: ".$_POST['message']." \n";
$body .= "Bron: ".$_POST['page']." \n";
# add more fields here if required

## SEND MESSGAE ##

mail( $recipient, $subject, $body, "From: $sender" ) or die ("Mail could not be                                                                                                                                                              sent.");

## SHOW RESULT PAGE ##

header( "Location: https://krachtiger.be/$destination.html" );
?>
