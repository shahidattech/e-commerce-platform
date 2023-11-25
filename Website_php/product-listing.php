<!DOCTYPE html>
<!--[if IE 7]><html class="ie ie7"><![endif]-->
<!--[if IE 8]><html class="ie ie8"><![endif]-->
<!--[if IE 9]><html class="ie ie9"><![endif]-->
<html lang="en">
<?php include 'config/config.php' ?>
<?php
$mainCategoryID = $_GET['c'];
$sub_id = $_GET['s'];
$sub_sub_id = $_GET['ss'];
$color = $_GET['color'];
$cod = $_GET['cod'];
$price_min = $_GET['price_min'];
$price_max = $_GET['price_max'];

if ($mainCategoryID) {
  $getDataCatWise = getMainCategoryProductData('product', 'getProductByCategoryID', $mainCategoryID, $userId, $color, $cod, $price_min, $price_max);
  // var_dump($getDataCatWise->products);
  if ($getDataCatWise) {
    // $products = $getDataCatWise[0]->categories[0]->products;
    // $products = $getDataCatWise->categories[0]->products;;
    $products = $getDataCatWise->products;
  }
} else if ($sub_id) {
  $getDataCatWise = getSubProductData('product', 'getProductBySubCategoryID', $sub_id, $userId, $color, $cod, $price_min, $price_max);
  if ($getDataCatWise) {
    // $products = $getDataCatWise->sub_categories[0]->products;
    $products = $getDataCatWise->products;
  }
} else if ($sub_sub_id) {
  $getDataCatWise = getSubSubProductData('product', 'getProductBySubSubID', $sub_sub_id, $userId, $color, $cod, $price_min, $price_max);
  // var_dump($getDataCatWise->sub_sub_categories[0]->products);
  if ($getDataCatWise) {
    // $products = $getDataCatWise->sub_sub_categories[0]->products;
    $products = $getDataCatWise->products;
  }
}

$otherImages = [];

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
  <title>Product Listing</title>
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
    @media (max-width: 799px) {
      .ps-products-wrap .ps-sidebar {
        width: 100%;
        padding-right: 0;
        margin-right: 0;
        margin-bottom: 20px;
        max-width: 100%;
      }

      .ps-product__columns {
        padding-bottom: 10px;
      }

      .filter-btn {
        display: block;
        width: 100%;
        border: none;
        background-color: #4CAF50;
        padding: 14px 28px;
        font-size: 16px;
        cursor: pointer;
        text-align: center;
        color: white;
      }

    }
    .filter-btn {
        display: block;
        width: 100%;
        border: none;
        background-color: #4CAF50;
        padding: 14px 28px;
        font-size: 16px;
        cursor: pointer;
        text-align: center;
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
    <div class="ps-products-wrap pt-0 pb-0">
      <div class="ps-products" data-mh="product-listing">
        <div class="ps-product-action">
          <!-- <div class="ps-product__filter">
            <select class="ps-select selectpicker">
              <option value="1">Shortby</option>
              <option value="2">Name</option>
              <option value="3">Price (Low to High)</option>
              <option value="3">Price (High to Low)</option>
            </select>
          </div> -->
          <div class="ps-pagination">
            <!-- <ul class="pagination">
              <li><a href="#"><i class="fa fa-angle-left"></i></a></li>
              <li class="active"><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li><a href="#">...</a></li>
              <li><a href="#"><i class="fa fa-angle-right"></i></a></li>
            </ul> -->
          </div>
        </div>
        <div class="ps-product__columns">
          <?php foreach ($products as $p_key => $p) { ?>
            <div class="ps-product__column">
              <div class="ps-shoe mb-10">
                <div class="ps-shoe__thumbnail" style="text-align: center;">
                  <!-- <div class="ps-badge"><span>New</span></div>
                <div class="ps-badge ps-badge--sale ps-badge--2nd"><span>-35%</span></div><a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                  <img src="<?php echo $p->mainImageUrl; ?>" alt="" height="300" style="width:auto;"><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $p->productId; ?>"></a>
                </div>
                <div class="ps-shoe__content">
                  <div class="ps-shoe__variants">
                    <div class="ps-shoe__variant normal">
                      <?php 
                      if($p->otherImages){
                        $otherImages = $p->otherImages;
                      }
                      foreach ($otherImages as $key => $otherImage) { ?>
                      <img src="<?php echo $otherImage; ?>" alt="">
                      <?php } ?>
                    </div>
                    <!-- <select class="ps-rating ps-shoe__rating">
                    <option value="1">1</option>
                    <option value="1">2</option>
                    <option value="1">3</option>
                    <option value="1">4</option>
                    <option value="2">5</option>
                  </select> -->
                  </div>
                  <div class="ps-shoe__detail"><a class="ps-shoe__name" href="product-detail.php?p=<?php echo $p->productId; ?>"><?php echo $p->short_title; ?></a>
                    <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#"> Jordan</a></p> -->
                    <span class="ps-shoe__price">
                      <!-- <del>£220</del>  -->
                      ₹ <?php echo $p->price; ?>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          <?php } ?>
        </div>
        <div class="ps-product-action">
          <!-- <div class="ps-product__filter">
            <select class="ps-select selectpicker">
              <option value="1">Shortby</option>
              <option value="2">Name</option>
              <option value="3">Price (Low to High)</option>
              <option value="3">Price (High to Low)</option>
            </select>
          </div> -->
          <div class="ps-pagination">
            <!-- <ul class="pagination">
              <li><a href="#"><i class="fa fa-angle-left"></i></a></li>
              <li class="active"><a href="#">1</a></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li><a href="#">...</a></li>
              <li><a href="#"><i class="fa fa-angle-right"></i></a></li>
            </ul> -->
          </div>
        </div>
      </div>
      <div class="ps-sidebar" data-mh="product-listing">
        <!-- <aside class="ps-widget--sidebar ps-widget--category">
          <div class="ps-widget__header">
            <h3>Category</h3>
          </div>
          <div class="ps-widget__content">
            <ul class="ps-list--checked">
              <li class="current"><a href="product-listing.php">Life(521)</a></li>
              <li><a href="product-listing.php">Running(76)</a></li>
              <li><a href="product-listing.php">Baseball(21)</a></li>
              <li><a href="product-listing.php">Football(105)</a></li>
              <li><a href="product-listing.php">Soccer(108)</a></li>
              <li><a href="product-listing.php">Trainning & game(47)</a></li>
              <li><a href="product-listing.php">More</a></li>
            </ul>
          </div>
        </aside>
        <aside class="ps-widget--sidebar ps-widget--filter">
          <div class="ps-widget__header">
            <h3>Category</h3>
          </div>
          <div class="ps-widget__content">
            <div class="ac-slider" data-default-min="300" data-default-max="2000" data-max="3450" data-step="50" data-unit="$"></div>
            <p class="ac-slider__meta">Price:<span class="ac-slider__value ac-slider__min"></span>-<span class="ac-slider__value ac-slider__max"></span></p><a class="ac-slider__filter ps-btn" href="#">Filter</a>
          </div>
        </aside>
        <aside class="ps-widget--sidebar ps-widget--category">
          <div class="ps-widget__header">
            <h3>Sky Brand</h3>
          </div>
          <div class="ps-widget__content">
            <ul class="ps-list--checked">
              <li class="current"><a href="product-listing.php">Nike(521)</a></li>
              <li><a href="product-listing.php">Adidas(76)</a></li>
              <li><a href="product-listing.php">Baseball(69)</a></li>
              <li><a href="product-listing.php">Gucci(36)</a></li>
              <li><a href="product-listing.php">Dior(108)</a></li>
              <li><a href="product-listing.php">B&G(108)</a></li>
              <li><a href="product-listing.php">Louis Vuiton(47)</a></li>
            </ul>
          </div>
        </aside>
        <aside class="ps-widget--sidebar ps-widget--category">
          <div class="ps-widget__header">
            <h3>Width</h3>
          </div>
          <div class="ps-widget__content">
            <ul class="ps-list--checked">
              <li class="current"><a href="product-listing.php">Narrow</a></li>
              <li><a href="product-listing.php">Regular</a></li>
              <li><a href="product-listing.php">Wide</a></li>
              <li><a href="product-listing.php">Extra Wide</a></li>
            </ul>
          </div>
        </aside> -->
        <div class="ps-sticky desktop">
          <!-- <aside class="ps-widget--sidebar">
            <div class="ps-widget__header">
              <h3>Size</h3>
            </div>
            <div class="ps-widget__content">
              <table class="table ps-table--size">
                <tbody>
                  <tr>
                    <td class="active">3</td>
                    <td>5.5</td>
                    <td>8</td>
                    <td>10.5</td>
                    <td>13</td>
                  </tr>
                  <tr>
                    <td>3.5</td>
                    <td>6</td>
                    <td>8.5</td>
                    <td>11</td>
                    <td>13.5</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>6.5</td>
                    <td>9</td>
                    <td>11.5</td>
                    <td>14</td>
                  </tr>
                  <tr>
                    <td>4.5</td>
                    <td>7</td>
                    <td>9.5</td>
                    <td>12</td>
                    <td>14.5</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>7.5</td>
                    <td>10</td>
                    <td>12.5</td>
                    <td>15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside> -->
          <aside class="ps-widget--sidebar">
            <h2>Filter Search</h2>
          </aside>
          <form action="">
            <?php if ($mainCategoryID) { ?>
              <input type="hidden" name="c" value="<?php echo $mainCategoryID; ?>">
            <?php } else if ($sub_id) { ?>
              <input type="hidden" name="s" value="<?php echo $sub_id; ?>">
            <?php } else if ($sub_sub_id) { ?>
              <input type="hidden" name="ss" value="<?php echo $sub_sub_id; ?>">
            <?php } ?>
            <aside class="ps-widget--sidebar">
              <div class="ps-widget__header">
                <h3>Color</h3>
              </div>
              <div class="ps-widget__content">
                <select name="color" id="colorFilter" class="form-control">
                  <option value="">Select an option</option>
                  <option value="RED">RED</option>
                  <option value="BLUE">BLUE</option>
                  <option value="GREEN">GREEN</option>
                  <option value="WHITE">WHITE</option>
                  <option value="PINK">PINK</option>
                  <option value="BLACK">BLACK</option>
                  <option value="VIOLATE">VIOLATE</option>
                  <option value="DARK GREEN">DARK GREEN</option>
                </select>
              </div>
            </aside>

            <aside class="ps-widget--sidebar">
              <div class="ps-widget__header">
                <h3>COD Available</h3>
              </div>
              <div class="ps-widget__content">
                <select name="cod" id="colorFilter" class="form-control">
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </aside>

            <aside class="ps-widget--sidebar">
              <div class="ps-widget__header">
                <h3>Price Range</h3>
              </div>
              <div class="ps-widget__content">
                <!-- <input type="range" id="points" name="points" min="0" max="10"> -->
                <div data-role="rangeslider">
                  <!-- <label for="price-min">Price:</label>
            <input type="range" name="price-min" id="price-min" value="200" min="0" max="1000">
            <label for="price-max">Price:</label>
            <input type="range" name="price-max" id="price-max" value="800" min="0" max="1000">
          </div> -->
                  <input type="hidden" name="price_min" id="price_min">
                  <input type="hidden" name="price_max" id="price_max">
                  <p>
                    <label for="amount">Price range:</label>
                    <input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;">
                  </p>
                  <div id="slider-range"></div>

                </div>
            </aside>

            <aside class="mb-10">
              <button class="btn filter-btn">Search</button>
            </aside>
          </form>
        </div>
        <!--aside.ps-widget--sidebar-->
        <!--    .ps-widget__header: h3 Ads Banner-->
        <!--    .ps-widget__content-->
        <!--        a(href='product-listing'): img(src="images/offer/sidebar.jpg" alt="")-->
        <!---->
        <!--aside.ps-widget--sidebar-->
        <!--    .ps-widget__header: h3 Best Seller-->
        <!--    .ps-widget__content-->
        <!--        - for (var i = 0; i < 3; i ++)-->
        <!--            .ps-shoe--sidebar-->
        <!--                .ps-shoe__thumbnail-->
        <!--                    a(href='#')-->
        <!--                    img(src="images/shoe/sidebar/"+(i+1)+".jpg" alt="")-->
        <!--                .ps-shoe__content-->
        <!--                    if i == 1-->
        <!--                        a(href='#').ps-shoe__title Nike Flight Bonafide-->
        <!--                    else if i == 2-->
        <!--                        a(href='#').ps-shoe__title Nike Sock Dart QS-->
        <!--                    else-->
        <!--                        a(href='#').ps-shoe__title Men's Sky-->
        <!--                    p <del> £253.00</del> £152.00-->
        <!--                    a(href='#').ps-btn PURCHASE-->
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

  <script>
    $(function() {
      $("#slider-range").slider({
        range: true,
        min: 10,
        max: 5000,
        values: [10, 1000],
        slide: function(event, ui) {
          $("#amount").val("₹" + ui.values[0] + " - ₹" + ui.values[1]);
          $("#price_min").val(ui.values[0]);
          $("#price_max").val(ui.values[1]);
        }
      });
      $("#amount").val("₹" + $("#slider-range").slider("values", 0) +
        " - ₹" + $("#slider-range").slider("values", 1));
      $("#price_min").val($("#slider-range").slider("values", 0));
      $("#price_max").val($("#slider-range").slider("values", 1));
    });
  </script>

</body>

</html>