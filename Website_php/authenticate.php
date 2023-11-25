<?php
require_once("./config/config.php");
// require_once './service.php';
if(isset($_GET['code'])){
	$googleClient->authenticate($_GET['code']);
	$_SESSION['token'] = $googleClient->getAccessToken();
	header('Location: ' . filter_var($redirectURL, FILTER_SANITIZE_URL));
}
############ Set Google access token ############
if (isset($_SESSION['token'])) {
	$googleClient->setAccessToken($_SESSION['token']);
}


if ($googleClient->getAccessToken()) {
	############ Fetch data from graph api  ############
	try {
		$gpUserProfile = $google_oauthV2->userinfo->get();
	}
	catch (\Exception $e) {
		echo 'Graph returned an error: ' . $e->getMessage();
		session_destroy();
		header("Location: ./");
		exit;
	}
	############ Store data in database  ############
	$oauthpro = "google";
	$oauthid = $gpUserProfile['id'] ?? '';
	$f_name = $gpUserProfile['given_name'] ?? '';
	$l_name = $gpUserProfile['family_name'];
	$gender = $gpUserProfile['gender'] ??  '';
	$email_id = $gpUserProfile['email'] ?? '';
	$locale = $gpUserProfile['locale'] ?? '';
	$picture = $gpUserProfile['picture'] ?? '';
	$url = $gpUserProfile['link'] ?? '';

	$_SESSION['userName'] = $gpUserProfile['name'] ?? '';
	$_SESSION['userEmail'] = $email_id;
	$_SESSION['userId'] = $oauthid;
	$_SESSION['userPicture'] = $picture;

	
	// $users->insertStoreUsers(
	// [
	// 	$oauthid => [
	// 		'email' => $email_id,
	// 		'name' => $gpUserProfile['name'] ?? ''
	// 		],
	// ]);

	if($_SESSION['checkoutPage']== 'yes'){
		header("Location: checkout.php");
	}else{
		header("Location: index.php");
	}

} else {
	header("Location:/");
}


?>