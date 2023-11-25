<?php

session_start();
$siteName ="MyGlobalBazar";

// production
// $webapiserver= "https://api.dynamicexecution.com/api/v1/website/";
// $searchServer = "https://api.dynamicexecution.com/api/search/";
// $userId = '602db088978f90c146ad3b44';

// test
// // seller user ID
$webapiserver= "http://localhost:7005/api/v1/website/";
$searchServer = "https://localhost:3301/api/search/";
$userId = '605750ba0e9f3e282942f61d';

// $prodPrimeServer = "https://api.bhbazar.com/api/shipmentglobal/fetchtrace?awbOrderId";
$prodPrimeServer = "https://api.bhbazar.com/api/";



// session_destroy();
// $path = 'http://localhost/newbai/WebsiteClinet/';
// $adminpanelserver= "http://localhost:7001/api/v1/";
// $webapiserver= "http://localhost:7005/api/v1/website/";
// $mediaserver="http://localhost:2001/api/v1/media/";
// $searchServer = "https://api.dynamicexecution.com/api/search/";



$storeDomain = $_SERVER['HTTP_HOST'];
$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
// $protocol = 'https://';

$redirectURL = $protocol.$storeDomain."/authenticate.php";


##### Google App Configuration #####
// test localhost:8888
$googleappid = '551742271090-nqb5scm4dq2igeol9di2fnscvcvhavnk.apps.googleusercontent.com';
$googleappsecret = 'tQYvdg8SOzBmjZlQNl1N2V43';

// Production
// $googleappid = '307201988359-28ru1llaekddhpkcpv9et6sts0f79nc3.apps.googleusercontent.com';
// $googleappsecret = 'Kvr5NyGwVxBQ7OJOSBXpR-PL';


// $redirectURL = "https://www.dynamicexecution.com/myglobal/authenticate.php"; 
// $redirectURL = "http://localhost:8888/authenticate.php"; 

##### Required Library #####
include_once 'Google/Google_Client.php';
include_once 'Google/contrib/Google_Oauth2Service.php';

$googleClient = new Google_Client();
$googleClient->setApplicationName('Login');
$googleClient->setClientId($googleappid);
$googleClient->setClientSecret($googleappsecret);
$googleClient->setRedirectUri($redirectURL);

$google_oauthV2 = new Google_Oauth2Service($googleClient);

// echo $_SESSION['userId'];
// echo $_SESSION['userName'];
// echo $_SESSION['userEmail'];

$storeGeneralInfo = null;
?>

<!-- /** including Function File **/  -->
<?php include 'functions.php'; ?>