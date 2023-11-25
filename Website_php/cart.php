<!DOCTYPE html>
<!--[if IE 7]><html class="ie ie7"><![endif]-->
<!--[if IE 8]><html class="ie ie8"><![endif]-->
<!--[if IE 9]><html class="ie ie9"><![endif]-->
<html lang="en">
<?php include 'config/config.php'; ?>

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
  <title>Cart</title>
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
    .form-group--number input.form-control {
      width: 60px;
    }
    .ps-product__preview{
      display: grid;
    text-align: center;
    }
    .ps-product__preview img{
      object-fit: contain;
    margin: auto;
    }
    .form-group--number{
      margin-top: 16px;
    }

    @media (max-width: 991px){
      .ps-cart-listing .ps-cart__table tbody > tr > td:first-child{
        min-width: 180px;
      }
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
    <div class="ps-content pt-80 pb-80">
      <div class="ps-container">
        <?php
        if (isset($_SESSION['cart_product_id']) && count($_SESSION['cart_product_id']) != 0) { ?>
          <div class="ps-cart-listing">
            <table class="table ps-cart__table">
              <thead>
                <tr>
                  <th>All Products</th>
                  <th>Price</th>
                  <!-- <th>Quantity</th> -->
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <?php
                for ($i = 0; $i < count($_SESSION['cart_product_id']); $i++) {
                ?>
                  <tr>
                    <td style="margin: 0;text-align: center;">
                      <a class="ps-product__preview" href="product-detail.php?p=<?php echo $_SESSION['cart_product_id'][$i]; ?>">
                        <img class="mr-15" src="<?php echo $_SESSION['cart_product_pic'][$i]; ?>" alt="" width="100" height="100" style="object-fit: contain;"> 
                        <p style="color: black;"><?php echo $_SESSION['cart_product_name'][$i]; ?></p>
                        <?php if($_SESSION['cart_product_name'][$i]){ ?>
                        <p style="color: black;text-transform: capitalize;"><?php echo $_SESSION['cart_product_weight'][$i]." ".$_SESSION['cart_product_unit'][$i]; ?></p>
                        <?php } ?>
                      </a>
                      <div class="form-group--number">
                        <?php if ($_SESSION['cart_product_qty'][$i] > 1) { ?>
                          <button class="minus" onclick="cartDecrease('<?php echo $i; ?>')"><span>-</span></button>
                        <?php } else { ?>
                          <button class="minus" onclick="removeItem('<?php echo $i; ?>')"><span>x</span></button>
                        <?php } ?>
                        <input class="form-control" type="text" value="<?php echo $_SESSION['cart_product_qty'][$i]; ?>">
                        <button class="plus" onclick="cartIncrease('<?php echo $i; ?>')"><span>+</span></button>
                      </div>
                    </td>
                    <td><b>₹ <?php echo $_SESSION['cart_product_price'][$i]; ?></b></td>
                    <!-- <td> -->
                      <!-- <div class="form-group--number">
                        <?php if ($_SESSION['cart_product_qty'][$i] > 1) { ?>
                          <button class="minus" onclick="cartDecrease('<?php echo $i; ?>')"><span>-</span></button>
                        <?php } else { ?>
                          <button class="minus" onclick="removeItem('<?php echo $i; ?>')"><span>x</span></button>
                        <?php } ?>
                        <input class="form-control" type="text" value="<?php echo $_SESSION['cart_product_qty'][$i]; ?>">
                        <button class="plus" onclick="cartIncrease('<?php echo $i; ?>')"><span>+</span></button>
                      </div> -->
                    <!-- </td> -->
                    <td><b>₹ <?php echo $_SESSION['cart_product_totalPrice'][$i]; ?></b></td>
                    <td>
                      <div class="ps-remove" onclick="removeItem('<?php echo $i; ?>')"></div>
                    </td>
                  </tr>
                <?php } ?>
              </tbody>
            </table>
            <div class="ps-cart__actions" style="padding-top: 5px;">
              <div class="ps-cart__promotion">
                <!-- <div class="form-group">
                  <div class="ps-form--icon"><i class="fa fa-angle-right"></i>
                    <input class="form-control" type="text" placeholder="Promo Code">
                  </div>
                </div>
                <div class="form-group">
                  <button class="ps-btn ps-btn--gray">Continue Shopping</button>
                </div> -->
              </div>
              <div class="ps-cart__total">
                <h3>Total Price: <span id="grandtotal_price"> <b>₹ <?php echo $_SESSION['gtotal']; ?></b></span></h3><a class="ps-btn" href="checkout.php">Checkout<i class="ps-icon-next"></i></a>
              </div>
            </div>
          </div>
        <?php } else { ?>
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
        <?php }  ?>
      </div>
    </div>
    <!-- <div class="ps-subscribe">
        <div class="ps-container">
          <div class="row">
                <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
                  <h3><i class="fa fa-envelope"></i>Sign up to Newsletter</h3>
                </div>
                <div class="col-lg-5 col-md-7 col-sm-12 col-xs-12 ">
                  <form class="ps-subscribe__form" action="do_action" method="post">
                    <input class="form-control" type="text" placeholder="">
                    <button>Sign up now</button>
                  </form>
                </div>
                <div class="col-lg-4 col-md-5 col-sm-12 col-xs-12 ">
                  <p>...and receive  <span>₹20</span>  coupon for first shopping.</p>
                </div>
          </div>
        </div>
      </div> -->

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