<?php
// include_once('config/config.php');
session_start();
if (isset($_POST['cartadd'])) {
    $c = count($_SESSION['cart_product_id']);
    $found = false;
    if ($c != 0) {
        for ($i = 0; $i < $c; $i++) {
            if ($_SESSION['cart_product_id'][$i] == $_POST['key'] && $_SESSION['cart_product_weight'][$i] == $_POST['weight']) {
                $found = true;
                $_SESSION['cart_product_qty'][$i]++;
                $_SESSION['cart_product_totalPrice'][$i] = $_SESSION['cart_product_price'][$i] * $_SESSION['cart_product_qty'][$i];
                break;
            }
        }
        if (!$found) {
            $_SESSION['cart_product_id'][] = $_POST['key'];
            $_SESSION['cart_product_name'][] = $_POST['name'];
            $_SESSION['cart_product_pic'][] = $_POST['pic'];
            $_SESSION['cart_product_qty'][] = 1;
            $_SESSION['cart_product_price'][] = $_POST['price'];
            $_SESSION['cart_product_totalPrice'][] = $_POST['price'];
            $_SESSION['cart_product_weight'][] = $_POST['weight'];
            $_SESSION['cart_product_unit'][] = $_POST['unit'];
            $_SESSION['cart_product_gst'][] = $_POST['gst'];
        }
    } else {
        $_SESSION['cart_product_id'][] = $_POST['key'];
        $_SESSION['cart_product_name'][] = $_POST['name'];
        $_SESSION['cart_product_pic'][] = $_POST['pic'];
        $_SESSION['cart_product_qty'][] = 1;
        $_SESSION['cart_product_price'][] = $_POST['price'];
        $_SESSION['cart_product_totalPrice'][] = $_POST['price'];
        $_SESSION['cart_product_weight'][] = $_POST['weight'];
        $_SESSION['cart_product_unit'][] = $_POST['unit'];
        $_SESSION['cart_product_gst'][] = $_POST['gst'];
    }

    $data = array(
        'status' => 'success',
        'total_cart_item' => count($_SESSION['cart_product_id'])
    );
    echo json_encode($data);
    // echo json_encode($_SESSION['cart_product_id']);
    // echo json_encode($_SESSION['cart_product_qty']);
    // echo json_encode($_SESSION['cart_product_price']);
    // echo json_encode($_SESSION['cart_product_totalPrice']);
    // echo "</br> n";
}

if (isset($_POST['carttotal']) && $_POST['carttotal'] == 'carttotal') {
    echo count($_SESSION['cart_product_id']);
}

if (isset($_POST['cartincrease'])) {
    if (isset($_POST['id'])) {
        $i = $_POST['id'];

        $_SESSION['cart_product_qty'][$i]++;
        $_SESSION['cart_product_totalPrice'][$i] = $_SESSION['cart_product_price'][$i] * $_SESSION['cart_product_qty'][$i];
    }
}

if (isset($_POST['cartdecrease'])) {
    if (isset($_POST['id'])) {
        $i = $_POST['id'];
        if ($_SESSION['cart_product_qty'][$i] > 1) {
            $_SESSION['cart_product_qty'][$i]--;
            $_SESSION['cart_product_totalPrice'][$i] = $_SESSION['cart_product_price'][$i] * $_SESSION['cart_product_qty'][$i];
        }
    }
}

if (isset($_POST['cartqtychange'])) {
    // require_once("./extra/config.php");
    // $qty = $_POST['qty'];
    // $productId = $_SESSION['cart_product_key'][$_POST['id']];
    // $_SESSION['cart_product_qty'][$_POST['id']] = $qty;

    // $totalPrice = $_SESSION['cart_product_price'][$_POST['id']] * $qty;
    // $_SESSION['cart_product_totalPrice'][$_POST['id']] = $totalPrice;

    // $action = "GET";
    // $getProductByIdUrl = $apiUrl . "/store/productbyid";
    // $parameterspProductId = array("SellerId" => $getSellerId, "ProductId" => $productId);
    // $productbyid = CurlHelper::perform_http_request($action, $getProductByIdUrl, $parameterspProductId);
    // $productbyids = json_decode($productbyid, true);
    // if ($productbyids['minqty']) {
    //     if ($qty >= $productbyids['minqty']) {
    //         $discount = $productbyids['discountqty'];

    //         $newPrice = $totalPrice * (1 - ($discount / 100));
    //         $_SESSION['cart_product_totalPrice'][$_POST['id']] = $newPrice;
    //         echo $newPrice;
    //         exit();
    //     } else {
    //         echo $totalPrice;
    //         exit();
    //     }
    // } else {
    //     echo $totalPrice;
    //     exit();
    // }
}

if (isset($_POST['grandtotalPriceCalculate']) && $_POST['grandtotalPriceCalculate'] == 'grandtotalPriceCalculate') {
    $c = count($_SESSION['cart_product_id']);
    $gtotal = 0;
    if ($c > 0) {
        for ($i = 0; $i < $c; $i++) {
            $gtotal = $gtotal + $_SESSION['cart_product_totalPrice'][$i];
        }
    }
    $_SESSION['gtotal'] = $gtotal;
    echo $gtotal;
}

if (isset($_POST['billInfo'])) {
    $_SESSION['billName'] = $_POST['billName'];
    $_SESSION['billPhone'] = $_POST['billPhone'];
    $_SESSION['billEmail'] = $_POST['billEmail'];
    $_SESSION['billAddress'] = $_POST['billAddress'];

    echo "Name: " . $_SESSION['billName'] . "<br>
    Email: " . $_SESSION['billEmail'] . "<br>
    Phone: " . $_SESSION['billPhone'] . "<br>
    Address: " . $_SESSION['billAddress'] . "<br>";
}
if (isset($_POST['shipInfo'])) {
    $_SESSION['shipName'] = $_POST['shipName'];
    $_SESSION['shipPhone'] = $_POST['shipPhone'];
    $_SESSION['shipEmail'] = $_POST['shipEmail'];
    $_SESSION['shipAddress'] = $_POST['shipAddress'];
    $_SESSION['shipLand'] = $_POST['shipLand'];
    $_SESSION['shipPin'] = $_POST['shipPin'];
    $_SESSION['shipState'] = $_POST['shipState'];
    $_SESSION['shipDist'] = $_POST['shipDist'];

    echo "Name: " . $_SESSION['shipName'] . "<br>
    Email: " . $_SESSION['shipEmail'] . "<br>
    Phone: " . $_SESSION['shipPhone'] . "<br>
    Address: " . $_SESSION['shipAddress'] . "<br>
    Landmark: " . $_SESSION['shipLand'] . "<br>
    Dist: " . $_SESSION['shipDist'] . "<br>
    State: " . $_SESSION['shipState'] . "<br>
    PinCode: " . $_SESSION['shipPin'] . "<br>";
}

if (isset($_POST['loginCheck'])) {
    if ($_SESSION['userId'] != '') {
        echo 'loggedin';
    }
}

if (isset($_POST['cartremove'])) {
    if (isset($_POST['id'])) {
        unset($_SESSION['cart_product_id'][$_POST['id']]);
        unset($_SESSION['cart_product_name'][$_POST['id']]);
        unset($_SESSION['cart_product_pic'][$_POST['id']]);
        unset($_SESSION['cart_product_qty'][$_POST['id']]);
        unset($_SESSION['cart_product_price'][$_POST['id']]);
        unset($_SESSION['cart_product_totalPrice'][$_POST['id']]);
        unset($_SESSION['cart_product_weight'][$_POST['id']]);
        unset($_SESSION['cart_product_unit'][$_POST['id']]);
        unset($_SESSION['cart_product_gst'][$_POST['id']]);

        $_SESSION['cart_product_id'] = array_values($_SESSION["cart_product_id"]);
        $_SESSION['cart_product_name'] = array_values($_SESSION["cart_product_name"]);
        $_SESSION['cart_product_pic'] = array_values($_SESSION["cart_product_pic"]);
        $_SESSION['cart_product_qty'] = array_values($_SESSION["cart_product_qty"]);
        $_SESSION['cart_product_price'] = array_values($_SESSION["cart_product_price"]);
        $_SESSION['cart_product_totalPrice'] = array_values($_SESSION["cart_product_totalPrice"]);
        $_SESSION['cart_product_weight'] = array_values($_SESSION["cart_product_weight"]);
        $_SESSION['cart_product_unit'] = array_values($_SESSION["cart_product_unit"]);
        $_SESSION['cart_product_gst'] = array_values($_SESSION["cart_product_gst"]);
    }
}

if (isset($_POST['payInfo'])) {
    $_SESSION['payMode'] = $_POST['payMod'];
    if ($_POST['payMod'] == 'cod') {
        echo 'COD';
    } else {
        echo 'Online Payment';
    }
}

if (isset($_POST['shippingRate'])) {
    $rate = $_POST['rate'];
    $courier_company_id = $_POST['id'];
    if ($rate && $courier_company_id) {
        $_SESSION['courier_company_id'] = $courier_company_id;
        $_SESSION['courier_rate'] = $rate;
        $data = array(
            'status' => 'success',
            'oTotal' => $_SESSION['courier_rate'] + $_SESSION['gtotal']
        );
        echo json_encode($data);
    }else{
        $data = array(
            'status' => 'error',
            'oTotal' => $_SESSION['courier_rate'] + $_SESSION['gtotal']
        );
        echo json_encode($data);
    }
}
