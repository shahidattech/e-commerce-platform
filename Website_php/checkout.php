<!DOCTYPE html>
<!--[if IE 7]><html class="ie ie7"><![endif]-->
<!--[if IE 8]><html class="ie ie8"><![endif]-->
<!--[if IE 9]><html class="ie ie9"><![endif]-->
<html lang="en">
<?php include 'config/config.php';


$loginURL = "";
$authUrl = $googleClient->createAuthUrl();
$loginURL = filter_var($authUrl, FILTER_SANITIZE_URL);

$totalAmount = $_SESSION['gtotal'];
// var_dump($_POST);

if (!empty($_POST)) {

  if ($_POST['payment'] == 'cod') {

    $c = count($_SESSION['cart_product_id']);
    $gtotal = 0;
    if ($c > 0) {
      for ($i = 0; $i < $c; $i++) {
        $gtotal = $gtotal + $_SESSION['cart_product_totalPrice'][$i];
      }
    }
    $_SESSION['gtotal'] = $gtotal;


    $today = date("Ymd");
    $rand = strtoupper(substr(uniqid(sha1(time())), 0, 4));
    $orderID = $today . $rand;

    $cartItems = array();
    for ($i = 0; $i < count($_SESSION['cart_product_id']); $i++) {
      $singleProduct = array(
        "productId" => $_SESSION['cart_product_id'][$i],
        "quantity" => $_SESSION['cart_product_qty'][$i],
        "mainImageUrl" => $_SESSION['cart_product_pic'][$i],
        "price" => $_SESSION['cart_product_totalPrice'][$i],
        "title" => $_SESSION['cart_product_name'][$i] . ' (' . $_SESSION['cart_product_weight'][$i] . ' ' . $_SESSION['cart_product_unit'][$i] . ')',
        "weight" => $_SESSION['cart_product_weight'][$i],
        "unit" => $_SESSION['cart_product_unit'][$i],
        "gst" => $_SESSION['cart_product_gst'][$i]
      );

      $cartItems[] = $singleProduct;
      // array_push($cartItems, array(json_encode($singleProduct)));
    }

    // var_dump($cartItems);
    // exit();


    $orderData = [
      "userId" => $userId,
      "customers" => [
        [
          "customerId" => $_SESSION['userId'],
          "orders" => [
            [
              "orderDetails" => [
                "products" => $cartItems
              ],
              "shippingDetails" => [
                "customerName" => $_POST['f_name'] . '' . $_POST['l_name'],
                "addressLine1" => $_POST['u_address'],
                "addressLine2" => $_POST['u_address'],
                "pinCode" => $_POST['u_pin'],
                "state" => $_POST['u_state'],
                "city" => $_POST['u_city'],
                "landMark" => $_POST['u_landmark'],
                "phoneNumber" => $_POST['u_mobile'],
                "alterNativeNumber" => $_POST['u_mobile'],
                "email" => $_POST['u_email']
              ],
              "paymentDetails" => [
                "paymentMode" => "COD",
                "paymendStatus" => "PENDING",
                // "payment_date" => date('Y-m-d')
              ],
              "additionalDetails" => [
                "courier_company_id" => $_SESSION['courier_company_id'],
                "courier_rate" => $_SESSION['courier_rate'],
                "order_amount" => $_SESSION['gtotal']
              ]
            ]
          ]
        ]
      ]
    ];

    $order_array = orderPlace('orders', 'placeOrder', $orderData);
    // var_dump($order_array);
    // header("Location: success.php");

    if ($order_array['status'] == 200) {
      header("Location: success-cod.php");
    } else {
      header("Location: error.php");
    }
  } else if ($_POST['payment'] == 'online') {
    // calculate total order amount
    $c = count($_SESSION['cart_product_id']);
    $gtotal = 0;
    if ($c > 0) {
      for ($i = 0; $i < $c; $i++) {
        $gtotal = $gtotal + $_SESSION['cart_product_totalPrice'][$i];
      }
    }
    $_SESSION['gtotal'] = $gtotal;

    // $today = date("Ymd");
    // $rand = strtoupper(substr(uniqid(sha1(time())), 0, 4));
    // $orderID = $today . $rand;

    $cartItems = array();
    for ($i = 0; $i < count($_SESSION['cart_product_id']); $i++) {
      $singleProduct = array(
        "productId" => $_SESSION['cart_product_id'][$i],
        "quantity" => $_SESSION['cart_product_qty'][$i],
        "mainImageUrl" => $_SESSION['cart_product_pic'][$i],
        "price" => $_SESSION['cart_product_totalPrice'][$i],
        "title" => $_SESSION['cart_product_name'][$i] . ' (' . $_SESSION['cart_product_weight'][$i] . ' ' . $_SESSION['cart_product_unit'][$i] . ')',
        "weight" => $_SESSION['cart_product_weight'][$i],
        "unit" => $_SESSION['cart_product_unit'][$i],
        "gst" => $_SESSION['cart_product_gst'][$i]
      );

      $cartItems[] = $singleProduct;
    }

    $orderData = [
      "userId" => $userId,
      "customers" => [
        [
          "customerId" => $_SESSION['userId'],
          "orders" => [
            [
              "orderDetails" => [
                "products" => $cartItems
              ],
              "shippingDetails" => [
                "customerName" => $_POST['f_name'] . '' . $_POST['l_name'],
                "addressLine1" => $_POST['u_address'],
                "addressLine2" => $_POST['u_address'],
                "pinCode" => $_POST['u_pin'],
                "state" => $_POST['u_state'],
                "city" => $_POST['u_city'],
                "landMark" => $_POST['u_landmark'],
                "phoneNumber" => $_POST['u_mobile'],
                "alterNativeNumber" => $_POST['u_mobile'],
                "email" => $_POST['u_email']
              ],
              "paymentDetails" => [
                "paymentMode" => "PREPAID",
                "paymendStatus" => "PENDING",
                // "payment_date" => date('Y-m-d')
              ],
              "additionalDetails" => [
                "courier_company_id" => $_SESSION['courier_company_id'],
                "courier_rate" => $_SESSION['courier_rate'],
                "order_amount" => $_SESSION['gtotal']
              ]
            ]
          ]
        ]
      ]
    ];
    $gtotal = $gtotal + $_SESSION['courier_rate'];

    $order_array = orderPlace('orders', 'placeOrder', $orderData);
    // var_dump($order_array);

    // echo $order_array['status'];

    if ($order_array['status'] == 200) {
      // $paymentData =[
      //   "udf1" => $userId,
      //   "storeDomain" => $storeDomain,
      //   "trxNo" => $orderID,
      //   "amount" => $gtotal,
      //   "email" => $_POST['u_email'],
      //   "phone" => $_POST['u_mobile'],
      //   "lastname" => $_POST['l_name'],
      //   "firstname" => $_POST['f_name']
      // ];

      $orderID = $order_array['data'];
      $customerID = $_SESSION['userId'];

      $paymentData = "udf1=" . $userId . "&customerID=" . $customerID . "&storeDomain=" . $storeDomain . "&orderID=" . $orderID . "&trxNo=" . $orderID . "&amount=" . $gtotal . "&email=" . $_POST['u_email'] . "&phone=" . $_POST['u_mobile'] . "&lastname=" . $_POST['l_name'] . "&firstname=" . $_POST['f_name'] . "";

      // $payment_array = payuMoneyPaymentProcess('orderpayment', $paymentData);
      $payment_array = razorpayPaymentProcess('orderpaymentthroughrazorpay', $paymentData);
      // var_dump($payment_array);
      // echo $payment_array['data'];
      // if ($payment_array['data']) {
        // header("Location: " . $payment_array['data']);
      // } else {
        // header("Location: error.php");
      // }
    }


    // $ch = curl_init();

    // curl_setopt($ch, CURLOPT_URL,"http://localhost:7005/api/v1/website/orderpayment");
    // // curl_setopt($ch, CURLOPT_URL, "https://api.bhbazar.com/api/v1/website/orderpayment");
    // curl_setopt($ch, CURLOPT_POST, 1);
    // curl_setopt(
    //   $ch,
    //   CURLOPT_POSTFIELDS,
    //   "udf1=" . $userId . "&storeDomain=" . $storeDomain . "&trxNo=" . $orderID . "&amount=" . $gtotal . "&email=" . $_POST['u_email'] . "&phone=" . $_POST['u_mobile'] . "&lastname=" . $_POST['l_name'] . "&firstname=" . $_POST['f_name'] . ""
    // );
    // curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

    // // receive server response ...
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // $server_output = curl_exec($ch);

    // $data = json_decode($server_output, true);

    // var_dump(($data));

    // echo $data['data'];
    // curl_close($ch);
  }
}


?>

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link href="apple-touch-icon.png" rel="apple-touch-icon">
  <link href="favicon.png" rel="icon">
  <meta name="author" content="Nghia Minh Luong">
  <meta name="keywords" content="Default Description">
  <meta name="description" content="Default keyword">
  <title>Checkout</title>
  <!-- Fonts-->
  <link href="https://fonts.googleapis.com/css?family=Archivo+Narrow:300,400,700%7CMontserrat:300,400,500,600,700,800,900" rel="stylesheet">
  <link rel="stylesheet" href="plugins/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="plugins/ps-icon/style.css">
  <!-- CSS Library-->
  <link rel="stylesheet" href="plugins/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="plugins/owl-carousel/assets/owl.carousel.css">
  <link rel="stylesheet" href="plugins/jquery-bar-rating/dist/themes/fontawesome-stars.css">
  <link rel="stylesheet" href="plugins/slick/slick/slick.css">
  <link rel="stylesheet" href="plugins/bootstrap-select/dist/css/bootstrap-select.min.css">
  <link rel="stylesheet" href="plugins/Magnific-Popup/dist/magnific-popup.css">
  <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui.min.css">
  <link rel="stylesheet" href="plugins/revolution/css/settings.css">
  <link rel="stylesheet" href="plugins/revolution/css/layers.css">
  <link rel="stylesheet" href="plugins/revolution/css/navigation.css">
  <!-- Custom-->
  <link rel="stylesheet" href="css/style.css">
  <!--HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries-->
  <!--WARNING: Respond.js doesn't work if you view the page via file://-->
  <!--[if lt IE 9]><script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script><script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script><![endif]-->
  <style>
    .google-btn {
      background-color: #DF4B3B;
      color: white;
    }

    .google-btn:hover {
      color: white;
    }
  </style>
</head>
<!--[if IE 7]><body class="ie7 lt-ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 8]><body class="ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 9]><body class="ie9 lt-ie10"><![endif]-->

<body class="ps-loading1">

  <?php include('include/header.php'); ?>

  <!-- <div class="header-services">
    <div class="ps-services owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="7000" data-owl-gap="0" data-owl-nav="true" data-owl-dots="false" data-owl-item="1" data-owl-item-xs="1" data-owl-item-sm="1" data-owl-item-md="1" data-owl-item-lg="1" data-owl-duration="1000" data-owl-mousedrag="on">
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
    </div>
  </div> -->
  <main class="ps-main">
    <div class="ps-checkout pt-80 pb-80">
      <div class="ps-container">

        <?php if (isset($_SESSION['cart_product_id']) && count($_SESSION['cart_product_id']) != 0) {
          if ($_SESSION['userId']) { ?>

            <form class="ps-checkout__form" action="" method="post">
              <div class="row">
                <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 ">
                  <div class="ps-checkout__billing">
                    <h3>Billing Detail</h3>
                    <div class="form-group form-group--inline">
                      <label>First Name<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="f_name" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Last Name<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="l_name" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Email Address<span>*</span>
                      </label>
                      <input class="form-control" type="email" name="u_email" required value="<?php if ($_SESSION['userEmail']) echo $_SESSION['userEmail']; ?>">
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Mobile<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="u_mobile" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Full Address<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="u_address" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>State<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="u_state" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>City<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="u_city" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Landmark<span>*</span>
                      </label>
                      <input class="form-control" type="text" name="u_landmark" required>
                    </div>
                    <div class="form-group form-group--inline">
                      <label>Pin<span>*</span>
                      </label>
                      <input class="form-control" type="number" name="u_pin" required>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                  <div class="ps-checkout__order">
                    <header>
                      <h3>Your Order</h3>
                    </header>
                    <div class="content">
                      <table class="table ps-checkout__products">
                        <thead>
                          <tr>
                            <th class="text-uppercase">Product</th>
                            <th class="text-uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <?php
                          $totalWeight = 0;
                          for ($i = 0; $i < count($_SESSION['cart_product_id']); $i++) {
                            if ($_SESSION['cart_product_unit'][$i] == 'kg') {
                              $totalWeight = $totalWeight + $_SESSION['cart_product_weight'][$i] * $_SESSION['cart_product_qty'][$i];
                            } else if ($_SESSION['cart_product_unit'][$i] == 'grams') {
                              $totalWeight = $totalWeight + $_SESSION['cart_product_weight'][$i] / 1000 * $_SESSION['cart_product_qty'][$i];
                            }
                          ?>
                            <tr>
                              <td><?php echo $_SESSION['cart_product_name'][$i]; ?> x <?php echo $_SESSION['cart_product_qty'][$i]; ?></td>
                              <td>₹<?php echo $_SESSION['cart_product_totalPrice'][$i]; ?></td>
                            </tr>

                          <?php }
                          $totalWeight = (float) $totalWeight + 0.1;
                          ?>
                          <tr id="display_shipping_rate"></tr>
                          <tr id="order_total">
                            <td>Order Total</td>
                            <td>₹<?php echo $_SESSION['gtotal']; ?></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <?php if ($storeGeneralInfo->enableForShippingChargesCollect) { ?>
                      <footer class="shipping_calculation" id="shipping_calculation">
                        <h3>Calculate delivery charges</h3>
                        <div class="form-group paypal">
                          <button class="ps-btn ps-btn--fullwidth" id="calShip">Calculate Price<i class="ps-icon-next"></i></button>
                        </div>
                      </footer>
                      <?php if ($storeGeneralInfo->enableForOnlinePayment && $storeGeneralInfo->enableForCOD) { ?>
                        <footer class="payment_method" id="payment_method">
                          <h3>Payment Method</h3>
                          <div class="form-group cheque">
                            <div class="ps-radio">
                              <input class="form-control" type="radio" id="rdo01" name="payment" value="cod">
                              <label for="rdo01">Cash on delhivery</label>
                              <p></p>
                            </div>
                          </div>
                          <div class="form-group paypal">
                            <div class="ps-radio ps-radio--inline">
                              <input class="form-control" type="radio" name="payment" id="rdo02" value="online" checked>
                              <label for="rdo02">Online</label>
                            </div>
                            <ul class="ps-payment-method">
                              <li><img src="images/payment/1.png" alt=""></li>
                              <li><img src="images/payment/2.png" alt=""></li>
                            </ul>
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } else if ($storeGeneralInfo->enableForOnlinePayment) { ?>
                        <footer class="payment_method" id="payment_method">
                          <h3>Payment Method</h3>
                          <div class="form-group paypal">
                            <div class="ps-radio ps-radio--inline">
                              <input class="form-control" type="radio" name="payment" id="rdo02" value="online" checked>
                              <label for="rdo02">Online</label>
                            </div>
                            <ul class="ps-payment-method">
                              <li><img src="images/payment/1.png" alt=""></li>
                              <li><img src="images/payment/2.png" alt=""></li>
                            </ul>
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } else if ($storeGeneralInfo->enableForCOD) { ?>
                        <footer class="payment_method" id="payment_method">
                          <h3>Payment Method</h3>
                          <div class="form-group cheque">
                            <div class="ps-radio">
                              <input class="form-control" type="radio" id="rdo01" name="payment" value="cod" checked>
                              <label for="rdo01">Cash on delhivery</label>
                              <p></p>
                            </div>
                          </div>
                          <div class="form-group paypal">
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } ?>
                    <?php } else { ?>

                      <?php
                      $_SESSION['courier_rate'] = 0;
                      if ($storeGeneralInfo->enableForOnlinePayment && $storeGeneralInfo->enableForCOD) { ?>
                        <footer class="payment_method" id="payment_method2">
                          <h3>Payment Method</h3>
                          <div class="form-group cheque">
                            <div class="ps-radio">
                              <input class="form-control" type="radio" id="rdo01" name="payment" value="cod">
                              <label for="rdo01">Cash on delhivery</label>
                              <p></p>
                            </div>
                          </div>
                          <div class="form-group paypal">
                            <div class="ps-radio ps-radio--inline">
                              <input class="form-control" type="radio" name="payment" id="rdo02" value="online" checked>
                              <label for="rdo02">Online</label>
                            </div>
                            <ul class="ps-payment-method">
                              <li><img src="images/payment/1.png" alt=""></li>
                              <li><img src="images/payment/2.png" alt=""></li>
                            </ul>
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } else if ($storeGeneralInfo->enableForOnlinePayment) { ?>
                        <footer class="payment_method" id="payment_method2">
                          <h3>Payment Method</h3>
                          <div class="form-group paypal">
                            <div class="ps-radio ps-radio--inline">
                              <input class="form-control" type="radio" name="payment" id="rdo02" value="online" checked>
                              <label for="rdo02">Online</label>
                            </div>
                            <ul class="ps-payment-method">
                              <li><img src="images/payment/1.png" alt=""></li>
                              <li><img src="images/payment/2.png" alt=""></li>
                            </ul>
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } else if ($storeGeneralInfo->enableForCOD) { ?>
                        <footer class="payment_method" id="payment_method2">
                          <h3>Payment Method</h3>
                          <div class="form-group cheque">
                            <div class="ps-radio">
                              <input class="form-control" type="radio" id="rdo01" name="payment" value="cod" checked>
                              <label for="rdo01">Cash on delhivery</label>
                              <p></p>
                            </div>
                          </div>
                          <div class="form-group paypal">
                            <button class="ps-btn ps-btn--fullwidth">Place Order<i class="ps-icon-next"></i></button>
                          </div>
                        </footer>
                      <?php } ?>

                    <?php } ?>
                  </div>
                </div>
              </div>
            </form>

          <?php } else { ?>
            <center><a href="<?= htmlspecialchars($loginURL); ?>" class="btn google-btn social-btn" type="button"><span><i class="fa fa-google-plus"></i> Sign in with Google+</span> </a></center>
          <?php }
        } else { ?>
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body cart">
                    <div class="col-sm-12 empty-cart-cls text-center"> <img src="https://i.imgur.com/dCdflKN.png" width="130" height="130" class="img-fluid mb-4 mr-3">
                      <h3><strong>Your Cart is Empty</strong></h3>
                      <h4>Add something to make me happy :)</h4>
                      <a href="/" class="btn btn-primary cart-btn-transform m-3 mt-10" data-abc="true">Continue shopping</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <?php } ?>
      </div>
    </div>

    <?php include('include/footer.php'); ?>

    <div style="z-index: 999999;" class="modal fade" id="shippingModal" tabindex="-1" role="dialog" aria-labelledby="shippingModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="shippingModalLabel">Select Courier Service</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>COURIER COMPANY</th>
                  <th>RATES</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="shipBody">
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

  </main>
  <!-- JS Library-->
  <script type="text/javascript" src="plugins/jquery/dist/jquery.min.js"></script>
  <script type="text/javascript" src="plugins/bootstrap/dist/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="plugins/jquery-bar-rating/dist/jquery.barrating.min.js"></script>
  <script type="text/javascript" src="plugins/owl-carousel/owl.carousel.min.js"></script>
  <script type="text/javascript" src="plugins/gmap3.min.js"></script>
  <script type="text/javascript" src="plugins/imagesloaded.pkgd.js"></script>
  <script type="text/javascript" src="plugins/isotope.pkgd.min.js"></script>
  <script type="text/javascript" src="plugins/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
  <script type="text/javascript" src="plugins/jquery.matchHeight-min.js"></script>
  <script type="text/javascript" src="plugins/slick/slick/slick.min.js"></script>
  <script type="text/javascript" src="plugins/elevatezoom/jquery.elevatezoom.js"></script>
  <script type="text/javascript" src="plugins/Magnific-Popup/dist/jquery.magnific-popup.min.js"></script>
  <script type="text/javascript" src="plugins/jquery-ui/jquery-ui.min.js"></script>
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAx39JFH5nhxze1ZydH-Kl8xXM3OK4fvcg&amp;region=GB"></script>
  <script type="text/javascript" src="plugins/revolution/js/jquery.themepunch.tools.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/jquery.themepunch.revolution.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.video.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.slideanims.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.layeranimation.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.navigation.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.parallax.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.actions.min.js"></script>
  <!-- Custom scripts-->
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <script type="text/javascript" src="js/main.js"></script>
  <?php include('script_function.php'); ?>
  <script>
    $(function() {
      $("#payment_method").hide();
      $("input[name=u_pin]").keyup(reCalculation);
    });

    function reCalculation() {
      $("#payment_method").hide();
    }
    // function calculateShipping(){
    $("#calShip").click(function(e) {
      e.preventDefault();

      var pin = $("input[name=u_pin]").val();

      if (pin && pin.length == 6) {
        // console.log("kkk", pin);

        let url = "https://api.bhbazar.com/api/shipmentglobal/serviceavailibility";
        // let weight = parseFloat('<?php //echo $totalWeight; 
                                    ?>') + parseFloat(100);
        let data = {
          "pickupPinCode": <?php echo $sellerPinCode; ?>,
          "deliveryPinCode": pin,
          "weight": <?php echo $totalWeight; ?>,
          // "weight": 0.5,
          "paymentMethod": 0,
          "amount": <?php echo $totalAmount; ?>
        };

        $.ajax({
          type: "POST",
          url: url,
          data: data,
          dataType: "json",
          success: function(data, status, jqXHR) {
            // console.log(data);
            // console.log(status);
            // console.log(jqXHR);

            let tData = '';
            if (status == 'success' && data && data.data) {
              if (data.status == "SUCCESS") {
                $.each(data.data, function(key, value) {
                  // console.log(key);
                  // console.log(value);
                  if (value.courier_name && value.rate) {
                    tData += '<tr><td>' + value.courier_name + '</td><td>' + value.rate + '</td><td>' +
                      '<button class="btn-success" onclick="selectCourier(`' + value.courier_company_id + '`, `' + value.rate + '`)">Select</button>' +
                      '</td></tr>';
                  }
                  $("#shipBody").html(tData);
                });
                $("#shippingModal").modal('show');
              } else {
                swal("Sorry!!", data.data, "error");
              }
            } else {
              swal("Error!!", "Server error please try again later.", "error");
            }
          },

          error: function(jqXHR, status) {
            swal("Error!!", "Server error please try again later.", "error");
            // error handler
            // console.log(status);
            // console.log(jqXHR);
          }
        });
      } else {
        swal("Incorrect!!", "Please enter a valid pin number", "error");
      }

    });
    // }

    function selectCourier(id, rate) {
      // console.log(id);
      // console.log(rate);
      if (id && rate) {
        $("#shippingModal").modal('hide');

        $.ajax({
          type: 'post',
          url: 'cartadd.php',
          data: {
            shippingRate: 'shippingRate',
            id,
            rate
          },
          success: function(response) {
            // console.log(response);
            if (response) {
              var res_json = JSON.parse(response);
              if (res_json.status == 'success') {
                let disp = "<td>Delivery Charges</td><td>₹ " + rate + "</td>"
                let o_total = "<td>Order Total</td><td>₹ " + res_json.oTotal + "</td>"
                $("#display_shipping_rate").html(disp);
                $("#order_total").html(o_total);
                $("#payment_method").show();
              }
            }
          }
        });
      }
    }
  </script>

  <?php if ($payment_array['status'] == 200) { ?>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
      var options = {
        "key": '<?php echo $payment_array['data']['key_id'] ?>', // Enter the Key ID generated from the Dashboard
        "amount": '<?php echo $payment_array['data']['amount'] ?>', // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": '<?php echo $siteName;?>',
        "description": "online payment",
        "image": "https://myglobalbazar-image-uploads.s3.ap-south-1.amazonaws.com/logoImage/logoImage_1617860574268_logo%20%282%29.png",
        "order_id": '<?php echo $payment_array['data']['id']; ?>', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "callback_url": "success.php",
        "prefill": {
          "name": '<?php echo $payment_array['data']['notes']['firstname']; ?>' + ' ' + '<?php echo $payment_array['data']['notes']['lastname']; ?>',
          "email": '<?php echo $payment_array['data']['notes']['email']; ?>',
          "contact": '<?php echo $payment_array['data']['notes']['phone']; ?>',
        },
        "notes": {
          email: '<?php echo $payment_array['data']['notes']['email']; ?>',
          phone: '<?php echo $payment_array['data']['notes']['phone']; ?>',
          lastname: '<?php echo $payment_array['data']['notes']['lastname']; ?>',
          firstname: '<?php echo $payment_array['data']['notes']['firstname']; ?>',
          storeDomain: '<?php echo $payment_array['data']['notes']['storeDomain']; ?>',
          sellerId: '<?php echo $payment_array['data']['notes']['sellerId']; ?>',
          customerId: '<?php echo $payment_array['data']['notes']['customerId']; ?>',
          receipt: '<?php echo $payment_array['data']['notes']['receipt']; ?>',
        },
        "theme": {
          "color": "#3399cc"
        }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
    </script>

  <?php } ?>

</body>

</html>