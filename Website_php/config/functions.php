<?php
// echo phpinfo();
/** Homepage Api **/
function getHomePageData($contentType, $dataType, $userId)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?userId={$userId}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->result;
    return $apiDataArrays[0];
}

function getHomeSliderData($contentType, $dataType, $userId)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?userId={$userId}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->result;
    return $apiDataArrays;
}

function getProductByID($contentType, $dataType, $productId, $userId)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    // $apiData = "{$webapiserver}{$contentType}/{$dataType}?productId={$productId}&userId={$userId}";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?productId={$productId}&userId={$userId}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    // $apiDataArrays = $ApidataContentdecoded->result;
    $apiDataArrays = $ApidataContentdecoded->data;
    return $apiDataArrays->products[0];
}

function getCategories($contentType, $dataType, $userId)
{
    // global $mediaserver;
    global $webapiserver;

    $apiData = "{$webapiserver}{$contentType}/{$dataType}?userId={$userId}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    // var_dump($ApidataContentdecoded);
    // $apiDataArrays = $ApidataContentdecoded->data;
    $apiDataArrays = $ApidataContentdecoded->cat_subCat_subSubCat;
    // return $apiDataArrays;
    return $ApidataContentdecoded;
}

function getSectionData($dataArray, $section_key)
{
    $hp_section_data = $dataArray->$section_key;
    array_multisort($hp_section_data);
    return $hp_section_data;
}

function getMainCategoryProductData($contentType, $dataType, $subCategoryId, $userId, $color, $reviewed, $price_min, $price_max)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?categoryId={$subCategoryId}&userId={$userId}&color={$color}&reviewed={$reviewed}&price_min={$price_min}&price_max={$price_max}";
    $apiDataContents = file_get_contents($apiData);
     $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->data;
    return $apiDataArrays;
}

function getSubProductData($contentType, $dataType, $subCategoryId, $userId, $color, $reviewed, $price_min, $price_max)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?subCategoryId={$subCategoryId}&userId={$userId}&color={$color}&reviewed={$reviewed}&price_min={$price_min}&price_max={$price_max}";
    $apiDataContents = file_get_contents($apiData);
     $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->data;
    return $apiDataArrays;
}

function getSubSubProductData($contentType, $dataType, $subSubCategoryId, $userId, $color, $reviewed, $price_min, $price_max)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?subSubCategoryId={$subSubCategoryId}&userId={$userId}&color={$color}&reviewed={$reviewed}&price_min={$price_min}&price_max={$price_max}";
    $apiDataContents = file_get_contents($apiData);
     $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->data;
    return $apiDataArrays;
}


function orderPlace($contentType, $dataType, $orderData){
    global $webapiserver;

    $apiUrl = "{$webapiserver}{$contentType}/{$dataType}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      http_build_query($orderData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);
    curl_close($ch);
    return json_decode($server_output, true);
}


function payuMoneyPaymentProcess($contentType, $paymentData){
    global $webapiserver;
    
    $apiUrl = "{$webapiserver}{$contentType}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      $paymentData
    //   http_build_query($paymentData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);

    // $data = json_decode($server_output, true);

    // var_dump(($data));

    // echo $data['data'];
    curl_close($ch);

    return json_decode($server_output, true);
}

function getOrderList($contentType, $dataType, $userId, $customerId, $page)
{
    // global $mediaserver;
    global $webapiserver;

    // $mediaServer= "{$mediaserver}resource/downloadfile";
    $apiData = "{$webapiserver}{$contentType}/{$dataType}?userId={$userId}&customerId={$customerId}&page={$page}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    $apiDataArrays = $ApidataContentdecoded->data;
    return $apiDataArrays;
}


function orderTrackDetails($contentType, $dataType, $awbOrderId){
    global $prodPrimeServer;

    $apiData = "{$prodPrimeServer}{$contentType}/{$dataType}?awbOrderId={$awbOrderId}";
    $apiDataContents = file_get_contents($apiData);
    $ApidataContentdecoded = json_decode($apiDataContents);
    // var_dump($ApidataContentdecoded);
    $apiDataArrays = $ApidataContentdecoded;
    return $apiDataArrays;
}


function postReview($contentType, $dataType, $reviewData){
    global $webapiserver;

    $apiUrl = "{$webapiserver}{$contentType}/{$dataType}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      http_build_query($reviewData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);
    curl_close($ch);
    return json_decode($server_output, true);
}

function createCustomer($contentType, $dataType, $customerData){
    global $webapiserver;

    $apiUrl = "{$webapiserver}{$contentType}/{$dataType}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      http_build_query($customerData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);
    curl_close($ch);
    return json_decode($server_output, true);
}

function razorpayPaymentProcess($contentType, $paymentData){
    global $webapiserver;
    
    $apiUrl = "{$webapiserver}{$contentType}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      $paymentData
    //   http_build_query($paymentData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);

    // $data = json_decode($server_output, true);

    // var_dump(($data));

    // echo $data['data'];
    curl_close($ch);

    return json_decode($server_output, true);
}

function razorpayPaymentSuccess($contentType, $paymentData){
    global $webapiserver;
    
    $apiUrl = "{$webapiserver}{$contentType}";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt(
      $ch,
      CURLOPT_POSTFIELDS,
      $paymentData
    //   http_build_query($paymentData)
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // receive server response ...
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $server_output = curl_exec($ch);

    // $data = json_decode($server_output, true);

    // var_dump(($data));

    // echo $data['data'];
    curl_close($ch);

    return json_decode($server_output, true);
}

?>