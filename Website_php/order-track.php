<!DOCTYPE html>
<!--[if IE 7]><html class="ie ie7"><![endif]-->
<!--[if IE 8]><html class="ie ie8"><![endif]-->
<!--[if IE 9]><html class="ie ie9"><![endif]-->
<html lang="en">
<?php include 'config/config.php';

// $productId = $_GET['p'];
$productId = '4710310258392';
$getTrackDetails = orderTrackDetails('shipmentglobal', 'fetchtrace', $productId);
// if ($getTrackDetails->status == 'SUCCESS') {
// } else {
// }
// var_dump($getTrackDetails->traceData);

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
  <title>Order Track</title>
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
    .status .col {
      font-weight: 800;
    }

    .discussion ul {
      position: relative;
    }

    .list-unstyled {
      padding-left: 0;
      list-style: none;
    }

    .discussion .task-list li {
      margin-bottom: 30px;
      padding-left: 16px;
      position: relative;
    }

    .trace_details {
      padding-left: 20px;
    }

    .discussion i {
      position: absolute;
      left: 15px;
      border-radius: 50%;
      min-width: 15px;
      min-height: 15px;
      z-index: 2;
      color: #488aff !important;
      background: #488aff;
    }

    .m-b-5 {
      margin-bottom: 5px;
      margin-left: 5px;
      font-weight: 800;
    }

    h6 {
      font-size: 16px;
      line-height: 22px;
      white-space: pre-wrap;
      padding-left: 5px;
    }

    .text-muted {
      color: #868e96 !important;
      padding-bottom: 12px;
    }

    .text-c-blue {
      color: #4680ff;
    }

    .discussion .task-list:before {
      content: "";
      position: absolute;
      background: #4889ff;
      height: 15px;
      width: 14px;
      bottom: -14px;
      left: 15px;
      z-index: 2;
      border-radius: 50%;
    }

    .discussion .task-list:after {
      content: "";
      position: absolute;
      background: #60aaf4;
      height: 100%;
      width: 2px;
      top: 0px;
      left: 21px;
      z-index: 1;
    }

    .status-section p {
      color: blue;
      font-weight: 800;
    }

    .reply-text {
      background: #ecedef;
      padding: 0;
      border-radius: 10px;
    }

    .reply-button .item-inner {
      padding-right: 0px !important;
      border-bottom: none !important;
    }

    .reply-title p {
      font-weight: 800;
      color: #757677;
      padding-left: 10px;
    }

    .ref-number {
      font-weight: 800;
      margin-bottom: 5px;
    }

    .who-reply {
      font-weight: 800;
      font-size: 18px;
      color: #0c8ff9;
    }

    .who-img {
      padding-left: 5px;
    }

    .who-img img {
      width: 30%;
    }

    .discussion .loc-icon {
      position: inherit;
      background: transparent;
    }

    .second-text {
      font-size: 12px;
      padding: 0;
      padding-left: 4px;
      margin: 0;
    }
  </style>
</head>
<!--[if IE 7]><body class="ie7 lt-ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 8]><body class="ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 9]><body class="ie9 lt-ie10"><![endif]-->

<body class="ps-loading">

  <?php include('include/header.php'); ?>

  <!-- <div class="header-services">
    <div class="ps-services owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="7000" data-owl-gap="0" data-owl-nav="true" data-owl-dots="false" data-owl-item="1" data-owl-item-xs="1" data-owl-item-sm="1" data-owl-item-md="1" data-owl-item-lg="1" data-owl-duration="1000" data-owl-mousedrag="on">
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery on every order</p>
    </div>
  </div> -->
  <main class="ps-main">
    <div class="ps-content pt-10 pb-80">
      <div class="ps-container">
        <section>
          <div>
            <div>
              <div class="card">
                <header class="card-header card-purple">
                  <?php if($getTrackDetails->status == 'SUCCESS' && $getTrackDetails->trackData[0]->Awb_Number) { ?>
                    AWB no. <?php echo $getTrackDetails->trackData[0]->Awb_Number; ?>
                  <?php } ?>
                  <p class="ref-number">
                  <?php if($getTrackDetails->status == 'SUCCESS' && $getTrackDetails->trackData[0]->channel_order_id) { ?>
                    Order ID: <?php echo $getTrackDetails->trackData[0]->channel_order_id; ?>
                  <?php } ?>
                  </p>
                </header>
                <div class="card-block">
                <?php if($getTrackDetails->status == 'SUCCESS' && $getTrackDetails->trackData[0]->status_location){ ?>
                  <p>
                    <i class="fa fa-map-marker"></i>
                    <?php echo $getTrackDetails->trackData[0]->status_location; ?>
                  </p>
                  <?php } ?>

                  <?php if($getTrackDetails->status == 'SUCCESS' && $getTrackDetails->trackData[0]->status){ ?>
                  <p>Status: <?php echo $getTrackDetails->trackData[0]->status; ?></p>
                  <?php } ?>
                  <!-- <p>Shipment Status: Shipping</p> -->
                  <!-- <p>Shipment Status:</p> -->
                  <!-- <p>Current Status: On the way</p> -->

                  <!-- <p>Pickup Date: 6-7-2021</p>
                  <p>Delivery Date: 9-7-2021</p>

                  <p>Weight: 2kg</p> -->

                </div>
              </div>
            </div>
            <?php if ($getTrackDetails->traceData) { ?>
              <div class="discussion">
                <ul class="list-unstyled task-list">

                  <?php foreach ($getTrackDetails->traceData as $key => $traceData) { ?>
                    <li>
                      <!-- <i class="zmdi zmdi-gps-dot"></i> -->
                      <i class="fa fa-dot-circle-o"></i>
                      <div class="trace_details">
                        <p class="m-b-5">
                          <i class="fa fa-map-marker"></i>
                          <?php if ($traceData->location) {
                            echo $traceData->location;
                          } ?>
                        </p>
                        <p><?php if ($traceData->dateTime) {
                              echo $traceData->dateTime;
                            } ?></p>
                        <?php if ($traceData->status) { ?>
                          <h6 class="text-muted second-text">
                            <?php echo $traceData->status; ?>
                          </h6>
                        <?php } ?>
                        <!-- <h6 class="text-muted">status</h6> -->
                        <!-- <h6 class="text-muted second-text"></h6> -->
                        <!-- <h6 class="text-muted"></h6> -->
                      </div>
                    </li>
                  <?php } ?>

                  <!-- <li>
                  <i class="fa fa-dot-circle-o"></i>
                  <div class="trace_details">
                    <p class="m-b-5">
                      <i class="fa fa-map-marker"></i>
                      Kolkata, West 34th Street, 15th floor, Kolkata
                    </p>
                    <p>6-7-2021</p>
                    <h6 class="text-muted second-text">On the way</h6>
                  </div>
                </li> -->

                </ul>
              </div>
            <?php } ?>

            <!-- <div>
              <p style="font-size: 20px;font-weight: 500;">No track details found</p>
            </div> -->
          </div>
        </section>
      </div>
    </div>


    <?php include('include/footer.php'); ?>

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
  <script type="text/javascript" src="js/main.js"></script>
  <?php include('script_function.php'); ?>
</body>

</html>