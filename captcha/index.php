<?php
$available_captchas = array(
	"popcorn" => "", 
	"balloon"=>"",
	"cheese"=>"", 
	"igloo"=>"", 
	"pizza"=>"", 
	"watermelon" => ""
);

foreach ($available_captchas as $key => $value) {
	$available_captchas[$key] = base64_encode(file_get_contents($key.'.png'));
}
try {
	$captchaname = array_rand($available_captchas);
	$captchaimage= $available_captchas[$captchaname];

	$optionIndex = array_rand(array(0, 1, 2));
	$totalCaptcha = array( $optionIndex => [$captchaname, $captchaimage]);

	while (sizeof($totalCaptcha) < 4) { 
		$randCaptcha = array_rand($available_captchas);
		$i = array_rand(array(0, 1, 2));

		$usedCaptchas = array();
		
		foreach ($totalCaptcha as $key => $value) {
			$usedCaptchas[] = $value[0];
		}
		
		if ($randCaptcha != $captchaname && !isset($totalCaptcha[$i]) && !array_search($randCaptcha, $usedCaptchas)){
			$totalCaptcha[$i] = [$randCaptcha, $available_captchas[$randCaptcha]];
		}
		if (sizeof($totalCaptcha) >= 3){break;}
	}
	$captcha_details = [$captchaname , $optionIndex];
	$totalCaptcha['captcha_details'] = $captcha_details;
	$json = json_encode($totalCaptcha);
	//setcookie('CAPTCHA', $captcha_details);

	print_r($json);

} catch (Exception $e) {
	die();
}


?>