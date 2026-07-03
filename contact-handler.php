<?php
header('Content-Type: application/json; charset=utf-8');

function respond($type, $text) {
    echo json_encode(['type' => $type, 'text' => $text]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond('error', 'Ongeldige aanvraag.');
}

// Honeypot: bots fill every field, humans never see this one
if (!empty($_POST['website'] ?? '')) {
    respond('message', 'Bedankt voor uw bericht!');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (mb_strlen($name) < 2) {
    respond('error', 'Gelieve uw naam in te vullen.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond('error', 'Gelieve een geldig e-mailadres in te vullen.');
}
if (mb_strlen($message) < 5) {
    respond('error', 'Gelieve een bericht in te vullen.');
}

// Strip newlines from header-bound values to block header injection
$name  = str_replace(["\r", "\n"], ' ', $name);
$email = str_replace(["\r", "\n"], '', $email);

$to        = 'erik.bervoets10@gmail.com';
$mailSubj  = 'Website berretti.be — ' . ($subject !== '' ? $subject : 'nieuw bericht') . ' van ' . $name;
$body      = "Naam: $name\n"
           . "Email: $email\n"
           . ($phone !== '' ? "Telefoon: $phone\n" : '')
           . ($subject !== '' ? "Onderwerp: $subject\n" : '')
           . "\nBericht:\n$message\n";
$headers   = "From: website@berretti.be\r\n"
           . "Reply-To: $email\r\n"
           . "X-Mailer: PHP/" . phpversion();

if (@mail($to, $mailSubj, $body, $headers)) {
    respond('message', "Bedankt $name! Uw bericht is verstuurd. Ik neem zo snel mogelijk contact met u op.");
}

respond('error', 'Het bericht kon niet worden verstuurd. Bel of mail ons gerust rechtstreeks.');
