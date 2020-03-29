<?php
if (!isset($_GET['font'])) {
	die('no');
}

$fontUri = 'https://secured.clubpenguin.com/sites/default/themes/club_penguin/fonts/';
$font = $_GET['font'];

$fontData = file_get_contents($fontUri.$font);

print_r($fontData);

// Write to that file for next request!
file_put_contents($font, $fontData);

?>