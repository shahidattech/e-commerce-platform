<!DOCTYPE html>
<html lang="en">

<?php include 'config/config.php' ?>
<?php
$productId = $_GET['p'];
$postReview = '';
if (isset($_POST['review_form_submitted'])) :
  if ($_SESSION['userId']) {
    $reviewData = [
      "userId" => $userId,
      "productId" => $productId,
      "customerId" => $_SESSION['userId'],
      "customerName" => $_SESSION['userName'],
      "customerProfilePic" => $_SESSION['userPicture'],
      "rating" => $_POST['ratingValue'],
      "review" => $_POST['reviewContent'],
    ];

    $postReview = postReview('product', 'addRatingAdnReviews', $reviewData);
  }
endif;


$getProductDetails = getProductByID('product', 'getProductByID', $productId, $userId);
// var_dump("ss", $getProductDetails);
$pTitle = $getProductDetails->title;
if (!$pTitle) {
  header('Location: /');
}
$pGst = $getProductDetails->gst;
// var_dump($pGst);
if ($pGst) {
  $pPrice = $getProductDetails->price;
  $pPrice = $getProductDetails->attributes[0]->price;
  $pPrice = $pPrice + ($pPrice * $pGst) / 100;
} else {
  // $pPrice = $getProductDetails->price;
  $pPrice = $getProductDetails->attributes[0]->price;
}
$pSort_title = $getProductDetails->short_title;
$pDescription = $getProductDetails->description;
$pMain_category = $getProductDetails->main_category;
$pSub_category = $getProductDetails->sub_category;
$pSub_sub_category = $getProductDetails->sub_sub_category;
$pReturn_policy = $getProductDetails->return_policy;
$pMian_Image = $getProductDetails->mainImage[0]->location;
$otherImages = $getProductDetails->otherImages;
$related_products = $getProductDetails->related_products;
$relatedSlideShows = $getProductDetails->relatedSlideShows;
$productReviews =  $getProductDetails->ratings_reviews ? $getProductDetails->ratings_reviews : '';
$pStock = $getProductDetails->stock;
$pWeight = $getProductDetails->weight;
// $pSize = $getProductDetails->size;
if ($pWeight) {
  $pWeight = explode(",", $pWeight);
  // var_dump($pWeight);
}

$loginURL = "";
$authUrl = $googleClient->createAuthUrl();
$loginURL = filter_var($authUrl, FILTER_SANITIZE_URL);


// store as recent product
$_SESSION['recent_product_id'][] = $productId;
$_SESSION['recent_product_name'][] = $pTitle;
$_SESSION['recent_product_pic'][] = $pMian_Image;
$_SESSION['recent_product_price'][] = $pPrice;

// $cc = count($_SESSION['recent_product_id']);
// $found = false;
// if ($cc != 0) {
//   if (!$found) {
//     $_SESSION['recent_product_id'][] = $_POST['key'];
//     $_SESSION['recent_product_name'][] = $_POST['name'];
//     $_SESSION['recent_product_pic'][] = $_POST['pic'];
//     $_SESSION['recent_product_price'][] = $_POST['price'];
//   }
// } else {
//   $_SESSION['recent_product_id'][] = $_POST['key'];
//   $_SESSION['recent_product_name'][] = $_POST['name'];
//   $_SESSION['recent_product_pic'][] = $_POST['pic'];
//   $_SESSION['recent_product_price'][] = $_POST['price'];
// }
?>
<!-- <pre><?php //print_r($postReview); 
          ?> </pre> -->

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
  <title><?php echo $pTitle; ?></title>
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.css" integrity="sha512-Velp0ebMKjcd9RiCoaHhLXkR1sFoCCWXNp6w4zj1hfMifYB5441C+sKeBl/T/Ka6NjBiRfBBQRaQq65ekYz3UQ==" crossorigin="anonymous" />
  <!--HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries-->
  <!--WARNING: Respond.js doesn't work if you view the page via file://-->
  <!--[if lt IE 9]><script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script><script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script><![endif]-->
  <style>
    .google-btn {
      background-color: #DF4B3B;
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
    <div class="test">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 ">
          </div>
        </div>
      </div>
    </div>
    <div class="ps-product--detail pt-5">
      <div class="ps-container">
        <?php if ($postReview && $postReview['status'] == 200) { ?>
          <div class="alert alert-success" role="alert">
            Thanks for providing your valuable feedback !!
          </div>
        <?php } ?>
        <div class="row">
          <div class="col-lg-10 col-md-12 col-lg-offset-1">
            <div class="ps-product__thumbnail">
              <div class="ps-product__preview">
                <div class="ps-product__variants">
                  <div class="item"><img src="<?php echo $pMian_Image; ?>" alt=""></div>
                  <?php foreach ($otherImages as $key => $otherImage) { ?>
                    <div class="item"><img src="<?php echo $otherImage->location; ?>" alt=""></div>
                  <?php } ?>

                  <!-- <div class="item"><img src="images/shoe-detail/2.jpg" alt=""></div>
                    <div class="item"><img src="images/shoe-detail/3.jpg" alt=""></div>
                    <div class="item"><img src="images/shoe-detail/3.jpg" alt=""></div>
                    <div class="item"><img src="images/shoe-detail/3.jpg" alt=""></div> -->
                </div>
                <!-- <a class="popup-youtube ps-product__video" href="http://www.youtube.com/watch?v=0O2aH4XLbto"><img src="<?php echo $pMian_Image; ?>" alt=""><i class="fa fa-play"></i></a> -->
              </div>
              <div class="ps-product__image">
                <div class="item"><img class="zoom" src="<?php echo $pMian_Image; ?>" alt="" data-zoom-image="<?php echo $pMian_Image; ?>"></div>
                <?php foreach ($otherImages as $key => $otherImage) { ?>
                  <div class="item"><img class="zoom" src="<?php echo $otherImage->location; ?>" alt="" data-zoom-image="<?php echo $otherImage->location; ?>"></div>
                <?php } ?>
                <!-- <div class="item"><img class="zoom" src="images/shoe-detail/2.jpg" alt="" data-zoom-image="images/shoe-detail/2.jpg"></div>
                  <div class="item"><img class="zoom" src="images/shoe-detail/3.jpg" alt="" data-zoom-image="images/shoe-detail/3.jpg"></div> -->
              </div>
            </div>
            <div class="ps-product__thumbnail--mobile">
              <div class="ps-product__main-img"><img src="<?php echo $pMian_Image; ?>" alt=""></div>
              <div class="ps-product__preview owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="20" data-owl-nav="true" data-owl-dots="false" data-owl-item="3" data-owl-item-xs="3" data-owl-item-sm="3" data-owl-item-md="3" data-owl-item-lg="3" data-owl-duration="1000" data-owl-mousedrag="on"><img src="<?php echo $pMian_Image; ?>" alt="">
                <?php foreach ($otherImages as $key => $otherImage) { ?>
                  <img src="<?php echo $otherImage->location; ?>" alt="">
                <?php } ?>
              </div>
            </div>
            <div class="ps-product__info">
              <!-- <div class="ps-product__rating">
                <select class="ps-rating">
                  <option value="1">1</option>
                  <option value="1">2</option>
                  <option value="1">3</option>
                  <option value="1">4</option>
                  <option value="2">5</option>
                </select><a href="#">(Read all 8 reviews)</a>
              </div> -->
              <h1><?php echo $pTitle; ?></h1>
              <!-- <p class="ps-product__category"><a href="#"> Men shoes</a>,<a href="#"> Nike</a>,<a href="#"> Jordan</a></p> -->
              <h3 class="ps-product__price" id="pPrice" style="margin-bottom: 0;">₹ <?php echo $pPrice; ?></h3>
              <?php if ($pGst) { ?>
                <span style="font-size: 13px;">(Including GST <?php echo $pGst . "%"; ?>)</span>
              <?php } ?>
              <div class="ps-product__block ps-product__quickview">
                <h4 style="padding-bottom: 5px;">QUICK DETAILS: <p style="margin-bottom: 0;margin-top: 4px;"><?php echo $pSort_title; ?></p>
                </h4>

              </div>
              <?php if ($pReturn_policy) { ?>
                <div class="ps-product__block ps-product__quickview">
                  <h4>Return Policy: <?php echo $pReturn_policy; ?></h4>
                  <!-- <p><?php echo $pReturn_policy; ?></p> -->
                </div>
              <?php } ?>
              <?php if ($getProductDetails->attributes) { ?>
                <div class="ps-product__block ps-product__quickview">
                  <h4>Weight:
                    <select name="pweight" id="pweight" onchange="changeWeight(this)">
                      <?php foreach ($getProductDetails->attributes as $key => $pAttributes) {  ?>
                        <option value='<?php echo json_encode($pAttributes); ?>'><?php echo $pAttributes->weight . " " . $pAttributes->unit . ""; ?></option>
                      <?php } ?>
                    </select>
                  </h4>
                </div>
              <?php } ?>
              <?php if ($pWeight && count($pWeight) > 0) { ?>
                <div class="ps-product__block ps-product__quickview">
                  <h4>Weight(gram):
                    <select name="pweight" id="pweight">
                      <?php foreach ($pWeight as $wkey => $w) { ?>
                        <option value="<?php echo $w; ?>"><?php echo $w; ?></option>
                      <?php } ?>
                    </select>
                  </h4>
                </div>
              <?php } ?>
              <?php if ($pStock && $pStock > 0) { ?>
                <div class="ps-product__block ps-product__quickview">
                  <h4>In Stock: <?php echo $pStock; ?></h4>
                </div>
              <?php } else { ?>
                <div class="ps-product__block ps-product__quickview">
                  <h4>Out Of Stock</h4>
                </div>
              <?php } ?>

              <!-- <div class="ps-product__block ps-product__style">
                  <h4>CHOOSE YOUR STYLE</h4>
                  <ul>
                    <li><a href="product-detail.php"><img src="images/shoe/sidebar/1.jpg" alt=""></a></li>
                    <li><a href="product-detail.php"><img src="images/shoe/sidebar/2.jpg" alt=""></a></li>
                    <li><a href="product-detail.php"><img src="images/shoe/sidebar/3.jpg" alt=""></a></li>
                    <li><a href="product-detail.php"><img src="images/shoe/sidebar/2.jpg" alt=""></a></li>
                  </ul>
                </div> -->
              <!-- <div class="ps-product__block ps-product__size">
                  <h4>CHOOSE SIZE<a href="#">Size chart</a></h4>
                  <select class="ps-select selectpicker">
                    <option value="1">Select Size</option>
                    <option value="2">4</option>
                    <option value="3">4.5</option>
                    <option value="3">5</option>
                    <option value="3">6</option>
                    <option value="3">6.5</option>
                    <option value="3">7</option>
                    <option value="3">7.5</option>
                    <option value="3">8</option>
                    <option value="3">8.5</option>
                    <option value="3">9</option>
                    <option value="3">9.5</option>
                    <option value="3">10</option>
                  </select>
                  <div class="form-group">
                    <input class="form-control" type="number" value="1">
                  </div>
                </div> -->
              <div class="ps-product__shopping" style="display: flex;">
                <?php if ($pStock && $pStock > 0) { ?>
                  <a style="width: 64%;" class="ps-btn text-center mb-10" href="javascript:void(0);" id="add_to_cart_<?php echo $productId; ?>" onclick="addtocart('<?php echo $productId; ?>', '<?php echo $pTitle; ?>', '<?php echo $pMian_Image; ?>')">Add to cart<i class="ps-icon-next"></i>
                  </a>
                <?php } ?>
                <div class="ps-product__actions">
                  <!-- <a class="mr-10" href="#"><i class="ps-icon-heart"></i></a> -->
                  <?php
                  $current_url      = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                  $validURL = str_replace("&", "&amp", $current_url);
                  ?>
                  <a href="http://www.facebook.com/sharer.php?u=<?php echo $validURL; ?>" target="_blank"><i class="fa fa-3x fa-facebook-square"></i></a>
                  <a href="mailto:?Subject=<?php echo $storeGeneralInfo->brandName; ?> - <?php echo $pTitle; ?>&body=<?php echo $pTitle; ?> - <?php echo $validURL; ?>" target="_blank"><i class="fa fa-3x fa-envelope-square"></i></a>

                </div>
              </div>
            </div>
            <div class="clearfix"></div>

            <div class="ps-product__content mt-50">
              <ul class="tab-list" role="tablist" style="display: flex;">
                <li class="active"><a href="#tab_01" aria-controls="tab_01" role="tab" data-toggle="tab">Overview</a></li>
                <li><a href="#tab_02" aria-controls="tab_02" role="tab" data-toggle="tab">Review</a></li>
                <!-- <li><a href="#tab_03" aria-controls="tab_03" role="tab" data-toggle="tab">PRODUCT TAG</a></li>
                  <li><a href="#tab_04" aria-controls="tab_04" role="tab" data-toggle="tab">ADDITIONAL</a></li> -->
              </ul>
            </div>
            <div class="tab-content mb-60">
              <div class="tab-pane active" role="tabpanel" id="tab_01">
                <p><?php echo $pDescription; ?></p>
              </div>
              <div class="tab-pane" role="tabpanel" id="tab_02">
                <p class="mb-20">Review for <strong><?php echo $pTitle; ?></strong></p>

                <?php foreach ($productReviews as $keyReview => $pReview) {
                  if ($pReview->isReviewApproved) {
                ?>
                    <div class="ps-review">
                      <div class="ps-review__thumbnail"><img src="images/user/1.jpg" alt=""></div>
                      <div class="ps-review__content">
                        <header>
                          <?php
                          for ($x = 0; $x < $pReview->rating; $x++) {
                            echo "<i class='fa fa-star' aria-hidden='true' style='color:#EDB867'></i>";
                          }
                          ?>

                          <!-- <select class="ps-rating">
                        <option value="<?php echo $pReview->rating; ?>" disabled selected>1</option>
                        <option value="<?php echo $pReview->rating; ?>" disabled selected>2</option>
                        <option value="<?php echo $pReview->rating; ?>" disabled selected>3</option>
                        <option value="<?php echo $pReview->rating; ?>" disabled selected>4</option>
                        <option value="<?php echo $pReview->rating; ?>" disabled selected>5</option>
                      </select> -->
                          <p>By<a href="javascript:void(0);"> <?php echo $pReview->customerName; ?></a> - <?php
                                                                                                          $date = date_create($pReview->added_date);
                                                                                                          echo date_format($date, "d-M-Y"); ?></p>
                        </header>
                        <p>
                          <?php echo $pReview->review; ?>
                        </p>
                      </div>
                    </div>

                <?php }
                } ?>
                <?php if ($_SESSION['userId']) { ?>
                  <form class="ps-product__review" action="" method="post">
                    <input type="hidden" name="review_form_submitted" value="1" />
                    <h4>ADD YOUR REVIEW</h4>
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                        <!-- <div class="form-group">
                        <label>Name:<span>*</span></label>
                        <input class="form-control" type="text" placeholder="">
                      </div>
                      <div class="form-group">
                        <label>Email:<span>*</span></label>
                        <input class="form-control" type="email" placeholder="">
                      </div> -->
                        <div class="form-group">
                          <label>Your rating<span></span></label>
                          <select class="ps-rating" name="ratingValue">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4" selected>4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-lg-8 col-md-8 col-sm-6 col-xs-12 ">
                        <div class="form-group">
                          <label>Your Review:</label>
                          <textarea class="form-control" rows="6" placeholder="Write your review" name="reviewContent" required></textarea>
                        </div>
                        <div class="form-group">
                          <button class="ps-btn ps-btn--sm">Submit<i class="ps-icon-next"></i></button>
                        </div>
                      </div>
                    </div>
                  </form>
                <?php } else { ?>
                  <div class="social-login text-center">
                    <p>Write your review after login</p>
                    <a href="<?= htmlspecialchars($loginURL); ?>" class="btn google-btn social-btn" type="button"><span><i class="fa fa-google-plus"></i> Sign in with Google+</span> </a>
                  </div>
                <?php } ?>

              </div>
              <div class="tab-pane" role="tabpanel" id="tab_03">
                <p>Add your tag <span> *</span></p>
                <form class="ps-product__tags" action="_action" method="post">
                  <div class="form-group">
                    <input class="form-control" type="text" placeholder="">
                    <button class="ps-btn ps-btn--sm">Add Tags</button>
                  </div>
                </form>
              </div>
              <div class="tab-pane" role="tabpanel" id="tab_04">
                <div class="form-group">
                  <textarea class="form-control" rows="6" placeholder="Enter your addition here..."></textarea>
                </div>
                <div class="form-group">
                  <button class="ps-btn" type="button">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <?php if (count($related_products) > 0) { ?>
      <?php //var_dump($related_products); 
      ?>
      <!-- <div class="ps-section ps-section--top-sales ps-owl-root pt-40 pb-80">
        <div class="ps-container">
          <div class="ps-section__header mb-50">
            <div class="row">
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
                <h3 class="ps-section__title" data-mask="Related item">- YOU MIGHT ALSO LIKE</h3>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                <div class="ps-owl-actions"><a class="ps-prev" href="#"><i class="ps-icon-arrow-right"></i>Prev</a><a class="ps-next" href="#">Next<i class="ps-icon-arrow-left"></i></a></div>
              </div>
            </div>
          </div>
          <div class="ps-section__content">
            <div class="ps-owl--colection owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="30" data-owl-nav="false" data-owl-dots="false" data-owl-item="4" data-owl-item-xs="2" data-owl-item-sm="2" data-owl-item-md="2" data-owl-item-lg="2" data-owl-duration="1000" data-owl-mousedrag="on"> -->

      <div class="ps-section ps-section--top-sales ps-owl-root">
        <div class="ps-container">
          <div class="ps-section__header mb-50">
            <div class="row">
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
                <h3 class="ps-section__title" data-mask="Related item">- YOU MIGHT ALSO LIKE</h3>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                <div class="ps-owl-actions"><a class="ps-prev" href="#"><i class="ps-icon-arrow-right"></i>Prev</a><a class="ps-next" href="#">Next<i class="ps-icon-arrow-left"></i></a></div>
              </div>
            </div>
          </div>
          <div class="ps-section__content">
            <div class="ps-owl--colection owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="30" data-owl-nav="false" data-owl-dots="false" data-owl-item="4" data-owl-item-xs="2" data-owl-item-sm="2" data-owl-item-md="3" data-owl-item-lg="4" data-owl-duration="1000" data-owl-mousedrag="on">
              <?php foreach ($related_products as $related_key => $related_product) {
                // echo var_dump($related_product);
                $relatedProductID = $related_product->_id;
                // $relatedProductID = '';
                $relatedProductTitle = $related_product->title;
                // $relatedProductSortTitle = $related_product->short_title;
                $relatedProductImage = $related_product->mainImage[0]->location;
                // $relatedProductSize = $related_product->size;
                $relatedProductPrice = $related_product->price;
              ?>
                <div class="ps-shoes--carousel">
                  <div class="ps-shoe">
                    <div class="ps-shoe__thumbnail">
                      <!-- <div class="ps-badge"><span>New</span></div> -->
                      <!-- <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                      <img src="<?php echo $relatedProductImage; ?>" alt=""><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $relatedProductID; ?>"></a>
                    </div>
                    <div class="ps-shoe__content">
                      <div class="ps-shoe__variants">
                        <div class="ps-shoe__variant normal"><img src="<?php echo $relatedProductImage; ?>" alt=""><img src="<?php echo $relatedProductImage; ?>" alt=""><img src="<?php echo $relatedProductImage; ?>" alt=""><img src="<?php echo $relatedProductImage; ?>" alt=""></div>
                        <!-- <select class="ps-rating ps-shoe__rating">
                      <option value="1">1</option>
                      <option value="1">2</option>
                      <option value="1">3</option>
                      <option value="1">4</option>
                      <option value="2">5</option>
                    </select> -->
                      </div>
                      <div class="ps-shoe__detail"><a class="ps-shoe__name" href="product-detail.php?p=<?php echo $relatedProductID; ?>"><?php echo $relatedProductTitle; ?></a>
                        <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#"> Jordan</a></p> -->
                        <span class="ps-shoe__price"> ₹ <?php echo $relatedProductPrice; ?></span>
                      </div>
                    </div>
                  </div>
                </div>
              <?php } ?>
            </div>
          </div>
        </div>
      </div>
    <?php } ?>


    <?php if (count($relatedSlideShows) > 0) { ?>
      <div class="ps-section ps-section--top-sales ps-owl-root pb-10">
        <div class="ps-container">
          <div class="ps-section__header">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                <h3 class="ps-section__title1 text-center" data-mask="">Catalogue</h3>
              </div>
            </div>
          </div>

          <div class="ps-section__content row">
            <div class="col-lg-3"></div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div id="carousel" class="carousel slide ml-20 mr-20 mb-20 mt-20">
                <ol class="carousel-indicators">
                  <?php
                  $slide = 0;
                  foreach ($relatedSlideShows[0]->slides as $slide_key => $slideShow) { ?>
                    <li data-target="#carousel" data-slide-to="<?php echo $slide; ?>" <?php if ($slide == 0) {
                                                                                        echo "class='active'";
                                                                                      } ?>></li>
                  <?php $slide++;
                  } ?>
                  <!-- <li data-target="#carousel" data-slide-to="1"></li>
            <li data-target="#carousel" data-slide-to="2"></li> -->
                </ol>

                <div class="carousel-inner">

                  <?php
                  $slide = 0;
                  foreach ($relatedSlideShows[0]->slides as $slide_key => $slideShow) { ?>
                    <div class="item <?php if ($slide == 0) {
                                        echo "active";
                                      } ?>">
                      <img src="<?php echo $slideShow->location; ?>" alt="Slide 1" />
                    </div>
                  <?php $slide++;
                  } ?>

                  <!-- <div class="item">
              <img src="https://picsum.photos/1500/600?image=2" alt="Slide 2" />
            </div>
            <div class="item">
              <img src="https://picsum.photos/1500/600?image=3" alt="Slide 3" />
            </div> -->
                </div>
                <a href="#carousel" class="left carousel-control" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left"></span>
                </a>
                <a href="#carousel" class="right carousel-control" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right"></span>
                </a>
              </div>
            </div>
            <div class="col-lg-3"></div>
          </div>
        </div>
      </div>



    <?php } ?>


    <!-- <div class="aligner">
      <div class="container">
        <div class="owl-carousel owl-theme">
          <div class="item">
            <a href="http://via.placeholder.com/200x200" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/200x200" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/300x300" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/400x400" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/500x500" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/600x600" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/700x700" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/800x800" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/900x900" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
          </div>
          <div class="item">
            <a href="http://via.placeholder.com/1000x1000" data-lightbox="gallery">
              <img src="http://via.placeholder.com/200x200" alt="">
            </a>
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
  <!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script> -->
  <script type="text/javascript" src="plugins/gmap3.min.js"></script>
  <script type="text/javascript" src="plugins/imagesloaded.pkgd.js"></script>
  <script type="text/javascript" src="plugins/isotope.pkgd.min.js"></script>
  <script type="text/javascript" src="plugins/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
  <script type="text/javascript" src="plugins/jquery.matchHeight-min.js"></script>
  <script type="text/javascript" src="plugins/slick/slick/slick.min.js"></script>
  <script type="text/javascript" src="plugins/elevatezoom/jquery.elevatezoom.js"></script>
  <script type="text/javascript" src="plugins/Magnific-Popup/dist/jquery.magnific-popup.min.js"></script>
  <script type="text/javascript" src="plugins/jquery-ui/jquery-ui.min.js"></script>
  <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAx39JFH5nhxze1ZydH-Kl8xXM3OK4fvcg&amp;region=GB"></script> -->
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
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.min.js" integrity="sha512-Y2IiVZeaBwXG1wSV7f13plqlmFOx8MdjuHyYFVoYzhyRr3nH/NMDjTBSswijzADdNzMyWNetbLMfOpIPl6Cv9g==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ekko-lightbox/5.3.0/ekko-lightbox.js.map"></script>

  <script>
    // $('.owl-carousel').owlCarousel({
    //   loop: true,
    //   margin: 10,
    //   nav: true,
    //   startPosition: 2,
    //   responsive: {
    //     0: {
    //       items: 1
    //     },
    //     600: {
    //       items: 2
    //     },
    //     1000: {
    //       items: 3
    //     }
    //   }
    // });

    // $(document).on('click', '[data-toggle="lightbox"]', function(event) {
    //   event.preventDefault();
    //   $(this).ekkoLightbox();
    // });
    productPrice = '<?php echo $pPrice; ?>';
    productWeight = '<?php echo $getProductDetails->attributes[0]->weight; ?>';
    productUnit = '<?php echo $getProductDetails->attributes[0]->unit; ?>';
    <?php if ($pGst) { ?>
      productGst = '<?php echo $pGst; ?>';
    <?php } else { ?>
      productGst = 0;
    <?php } ?>

    function changeWeight(data) {
      console.log(data);
      // console.log(JSON.parse($(data).find(":selected").val()));
      console.log(JSON.parse(data.value));
      let getData = JSON.parse($(data).find(":selected").val());
      productPrice = getData.price;
      productWeight = getData.weight;
      productUnit = getData.unit;
      productPrice = productPrice + (productPrice * parseInt(productGst)) / 100;
      $('#pPrice').html('₹ '+productPrice);
    }

    function addtocart(key, name, pic) {
        // console.log(key);
        // document.getElementById("add_to_cart_" + key).style.pointerEvents = 'none';
        // document.getElementById("add_to_cart_" + key).innerHTML = "ADDING TO CART";
        // var weight = $("#pweight option:selected").val();
        // console.log(weight);
        // if(!weight){
        //     weight = 0.5;
        // }
        // console.log('w', weight);
        // console.log(productPrice);
        // console.log(productWeight);
        // console.log(productUnit);
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                cartadd: 'cartadd',
                key,
                price: productPrice,
                weight: productWeight,
                unit: productUnit,
                name,
                pic,
                // weight
            },
            success: function(response) {
                // console.log(response);
                if (response) {
                    var res_json = JSON.parse(response);
                    if (res_json.status == 'success') {
                        document.getElementById("total_cart_item").innerHTML = res_json.total_cart_item;
                        cartTotalCalculate();
                        shoppingCart();
                        swal("Success!", "Successfully added to the cart", "success").then((value) => {
                            window.location.href = "cart.php"
                        });
                    }
                }
            }
        });
    }
  </script>

  <?php include('script_function.php'); ?>
</body>

</html>