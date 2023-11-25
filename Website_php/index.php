<!DOCTYPE html>
<html lang="en">
<?php include 'config/config.php' ?>
<?php

$homepage_array = getHomePageData('home', 'getHomeContent', $userId);
$homepage_slider_array = getHomeSliderData('home', 'getHomeSlider', $userId);

if (count($homepage_slider_array) > 0) {
  $homepage_slider_array = $homepage_slider_array[0]->sliders;
}

// $getcategories = getSectionData($homepage_array,'cat_subCat_subSubCat');
// print_r($getcategories);
$getSections = getSectionData($homepage_array, 'sections');
$getSection1 = getSectionData($getSections[0], 'section_1');
$getSection2 = getSectionData($getSections[0], 'section_2');
$getSection3 = getSectionData($getSections[0], 'section_3');

$section1Title = $getSection1->title;
$section2Title = $getSection2->title;
$section3Title = $getSection3->title;

$homeSection1 = getSectionData($getSection1, 'products');
$homeSection2 = getSectionData($getSection2, 'products');
$homeSection3 = getSectionData($getSection3, 'products');

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
  <title><?php echo $siteName; ?></title>
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
  <!-- <link rel="stylesheet" href="plugins/jquery-ui/jquery-ui.min.css"> -->
  <link rel="stylesheet" href="plugins/revolution/css/settings.css">
  <link rel="stylesheet" href="plugins/revolution/css/layers.css">
  <link rel="stylesheet" href="plugins/revolution/css/navigation.css">
  <!-- Custom-->

  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/jquery-ui.css">
  <link rel="stylesheet" href="css/responsive.css">
  <!--HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries-->
  <!--WARNING: Respond.js doesn't work if you view the page via file://-->
  <!--[if lt IE 9]><script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script><script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script><![endif]-->
</head>
<!--[if IE 7]><body class="ie7 lt-ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 8]><body class="ie8 lt-ie9 lt-ie10"><![endif]-->
<!--[if IE 9]><body class="ie9 lt-ie10"><![endif]-->

<body class="ps-loading1">
  <!-- <div class="header--sidebar"></div> -->

  <?php include('include/header.php'); ?>

  <!-- <div class="header-services">
    <div class="ps-services owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="7000" data-owl-gap="0" data-owl-nav="true" data-owl-dots="false" data-owl-item="1" data-owl-item-xs="1" data-owl-item-sm="1" data-owl-item-md="1" data-owl-item-lg="1" data-owl-duration="1000" data-owl-mousedrag="on">
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery
        on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery
        on every order</p>
      <p class="ps-service"><i class="ps-icon-delivery"></i><strong>Free delivery</strong>: Get free standard delivery
        on every order</p>
    </div>
  </div> -->
  <main class="ps-main">
    <div class="ps-banner">
      <div class="rev_slider fullscreenbanner" id="home-banner">
        <ul>

          <?php $i = 0;
          foreach ($homepage_slider_array as $key => $homepage_slide) {
            // print_r($homepage_slide);

            // $slideID = $homepage_slide->_id;
            $slideTitle = $homepage_slide->title;
            $sliderImage = $homepage_slide->image[0]->location;
          ?>

            <li class="ps-banner" data-index="rs-2972<?php echo $i; ?>" data-transition="random" data-slotamount="default" data-hideafterloop="0" data-hideslideonmobile="off" data-rotate="0"><img class="rev-slidebg" src="<?php echo $sliderImage; ?>" alt="" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="5" data-no-retina>
              <!-- <div class="tp-caption ps-banner__header" id="layer-1" data-x="left" data-hoffset="['-60','15','15','15']" data-y="['middle','middle','middle','middle']" data-voffset="['-150','-120','-150','-170']" data-width="['none','none','none','400']" data-type="text" data-responsive_offset="on" data-frames="[{&quot;delay&quot;:1000,&quot;speed&quot;:1500,&quot;frame&quot;:&quot;0&quot;,&quot;from&quot;:&quot;x:50px;opacity:0;&quot;,&quot;to&quot;:&quot;o:1;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:300,&quot;frame&quot;:&quot;999&quot;,&quot;to&quot;:&quot;x:50px;opacity:0;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;}]">
                <p>March 2002 <br> Nike SB Dunk Low Pro</p>
              </div> -->
              <div class="tp-caption ps-banner__title" id="layer21" data-x="['left','left','left','left']" data-hoffset="['-60','15','15','15']" data-y="['middle','middle','middle','middle']" data-voffset="['-60','-40','-50','-70']" data-type="text" data-responsive_offset="on" data-textAlign="['center','center','center','center']" data-frames="[{&quot;delay&quot;:1200,&quot;speed&quot;:1500,&quot;frame&quot;:&quot;0&quot;,&quot;from&quot;:&quot;x:50px;opacity:0;&quot;,&quot;to&quot;:&quot;o:1;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:300,&quot;frame&quot;:&quot;999&quot;,&quot;to&quot;:&quot;x:50px;opacity:0;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;}]">
                <p class="text-uppercase"><?php echo $slideTitle; ?></p>
              </div>
              <!-- <div class="tp-caption ps-banner__description" id="layer211" data-x="['left','left','left','left']" data-hoffset="['-60','15','15','15']" data-y="['middle','middle','middle','middle']" data-voffset="['30','50','50','50']" data-type="text" data-responsive_offset="on" data-textAlign="['center','center','center','center']" data-frames="[{&quot;delay&quot;:1200,&quot;speed&quot;:1500,&quot;frame&quot;:&quot;0&quot;,&quot;from&quot;:&quot;x:50px;opacity:0;&quot;,&quot;to&quot;:&quot;o:1;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:300,&quot;frame&quot;:&quot;999&quot;,&quot;to&quot;:&quot;x:50px;opacity:0;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;}]">
                <p>Supa wanted something that was going to rep his East Coast <br> roots and, more specifically, his
                  hometown of <br /> New York City in a big way.</p>
              </div><a class="tp-caption ps-btn" id="layer31" href="#" data-x="['left','left','left','left']" data-hoffset="['-60','15','15','15']" data-y="['middle','middle','middle','middle']" data-voffset="['120','140','200','200']" data-type="text" data-responsive_offset="on" data-textAlign="['center','center','center','center']" data-frames="[{&quot;delay&quot;:1500,&quot;speed&quot;:1500,&quot;frame&quot;:&quot;0&quot;,&quot;from&quot;:&quot;x:50px;opacity:0;&quot;,&quot;to&quot;:&quot;o:1;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;},{&quot;delay&quot;:&quot;wait&quot;,&quot;speed&quot;:300,&quot;frame&quot;:&quot;999&quot;,&quot;to&quot;:&quot;x:50px;opacity:0;&quot;,&quot;ease&quot;:&quot;Power3.easeInOut&quot;}]">Purchase
                Now<i class="ps-icon-next"></i></a> -->
            </li>

          <?php $i++;
          } ?>
        </ul>
      </div>
    </div>
    <?php if ($homeSection1) { ?>
      <div class="ps-section--features-product ps-section masonry-root pt-20 pb-10">
        <div class="ps-container">
          <div class="ps-section__header mb-20">
            <h3 class="ps-section__title1 text-center" data-mask=""><?php echo $section1Title; ?></h3>
          </div>
          <div class="ps-section__content pb-5">
            <div class="masonry-wrapper" data-col-md="4" data-col-sm="2" data-col-xs="1" data-gap="30" data-radio="100%">
              <div class="ps-masonry">
                <div class="grid-sizer"></div>


                <?php foreach ($homeSection1 as $key => $getSection1Product) {
                  $s1ProductID = $getSection1Product->_id;
                  $s1ProductTitle = $getSection1Product->title;
                  // $s1ProductSortTitle = $getSection1Product->short_title;
                  $s1ProductImage = $getSection1Product->mainImage[0]->location;
                  // $s1ProductSize = $getSection1Product->size;
                  // $s1ProductPrice = $getSection1Product->price;
                  $s1ProductPrice = $getSection1Product->attributes[0]->price;
                  $s1otherImages = $getSection1Product->otherImages;
                  if($getSection1Product->gst){
                    $s1ProductGst = $getSection1Product->gst;
                    $s1ProductPrice = $s1ProductPrice + ($s1ProductPrice * $s1ProductGst) / 100;
                  }
                ?>

                  <div class="grid-item kids">
                    <div class="grid-item__content-wrapper">
                      <div class="ps-shoe mb-30">
                        <div class="ps-shoe__thumbnail" style="text-align: center;">
                          <!-- <div class="ps-badge"><span>New</span></div> -->
                          <!-- <div class="ps-badge ps-badge--sale ps-badge--2nd"><span>-35%</span></div> -->
                          <!-- <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                          <img src="<?php echo $s1ProductImage; ?>" alt="" height="300" style="width:auto;"><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $s1ProductID; ?>"></a>
                        </div>
                        <div class="ps-shoe__content">
                          <div class="ps-shoe__variants">
                            <div class="ps-shoe__variant normal">
                            <?php foreach ($s1otherImages as $key_oimg => $oimg) { 
                              if($oimg->location){?>

                            <img src="<?php echo $oimg->location; ?>" alt="">
                            <?php }} ?>
                            <!-- <img src="<?php echo $s1ProductImage; ?>" alt="">
                            <img src="<?php echo $s1ProductImage; ?>" alt="">
                            <img src="<?php echo $s1ProductImage; ?>" alt=""> -->
                            </div>
                            <!-- <select class="ps-rating ps-shoe__rating">
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                            <option value="1">4</option>
                            <option value="2">5</option>
                          </select> -->
                          </div>
                          <div class="ps-shoe__detail" style="margin: 0px 30px;"><a class="ps-shoe__name" href="product-detail.php?p=<?php echo $s1ProductID; ?>"><?php echo substr($s1ProductTitle, 0, 50); ?></a>
                            <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#">
                              Jordan</a></p> -->
                            <span class="ps-shoe__price">
                              <!-- <del>220</del>  -->
                              ₹ <?php echo $s1ProductPrice; ?>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                <?php } ?>

              </div>
            </div>
          </div>
        </div>
      </div>
    <?php } ?>

    <style>
      .ps-section--offer .ps-column {
        max-height: 260px;
      }
    </style>
    <div class="ps-section--offer">
      <?php
      // $ii = 0;
      // foreach ($homepage_slider_array as $key => $homepage_slide) {
      //   $slideTitle = $homepage_slide->title;
      //   $sliderImage = $homepage_slide->image[0]->location;
      //   if($ii < 2){
      ?>
      <!-- <div class="ps-column"><a class="ps-offer" href="javascript:void(0);"><img src="<?php echo $sliderImage; ?>" alt=""></a></div> -->
      <?php //$ii++; }} 
      ?>
    </div>

    <?php if ($homeSection2) { ?>
      <div class="ps-section ps-section--top-sales ps-owl-root pt-10 pb-5">
        <div class="ps-container">
          <div class="ps-section__header mb-20">
            <div class="row">
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
                <h3 class="ps-section__title1 text-center" data-mask=""><?php echo $section2Title; ?></h3>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                <div class="ps-owl-actions"><a class="ps-prev" href="#"><i class="ps-icon-arrow-right"></i>Prev</a><a class="ps-next" href="#">Next<i class="ps-icon-arrow-left"></i></a></div>
              </div>
            </div>
          </div>
          <div class="ps-section__content">
            <div class="ps-owl--colection owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="30" data-owl-nav="false" data-owl-dots="false" data-owl-item="4" data-owl-item-xs="1" data-owl-item-sm="1" data-owl-item-md="3" data-owl-item-lg="4" data-owl-duration="1000" data-owl-mousedrag="on">


              <?php foreach ($homeSection2 as $key => $getSection2Product) {
                $s2ProductID = $getSection2Product->_id;
                $s2ProductTitle = $getSection2Product->title;
                // $s2ProductSortTitle = $getSection2Product->short_title;
                $s2ProductImage = $getSection2Product->mainImage[0]->location;
                // $s2ProductSize = $getSection2Product->size;
                // $s2ProductPrice = $getSection2Product->price;
                $s2ProductPrice = $getSection2Product->attributes[0]->price;
                $s2otherImages = $getSection2Product->otherImages;
                if($getSection2Product->gst){
                  $s2ProductGst = $getSection2Product->gst;
                  $s2ProductPrice = $s2ProductPrice + ($s2ProductPrice * $s2ProductGst) / 100;
                }
              ?>


                <div class="ps-shoes--carousel">
                  <div class="ps-shoe">
                    <div class="ps-shoe__thumbnail">
                      <!-- <div class="ps-badge"><span>New</span></div> -->
                      <!-- <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                      <img src="<?php echo $s2ProductImage; ?>" alt="" height="300" style="width:auto;margin: auto;"><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $s2ProductID; ?>"></a>
                    </div>
                    <div class="ps-shoe__content">
                      <div class="ps-shoe__variants">
                        <div class="ps-shoe__variant normal">
                        <?php foreach ($s2otherImages as $key_oimg2 => $oimg2) { 
                          if($oimg2->location){?>
                            <img src="<?php echo $oimg2->location; ?>" alt="">
                            <?php } } ?>
                        <!-- <img src="<?php echo $s2ProductImage; ?>" alt="">
                        <img src="<?php echo $s2ProductImage; ?>" alt="">
                        <img src="<?php echo $s2ProductImage; ?>" alt="">
                        <img src="<?php echo $s2ProductImage; ?>" alt=""> -->
                        </div>
                        <!-- <select class="ps-rating ps-shoe__rating">
                        <option value="1">1</option>
                        <option value="1">2</option>
                        <option value="1">3</option>
                        <option value="1">4</option>
                        <option value="2">5</option>
                      </select> -->
                      </div>
                      <div class="ps-shoe__detail" style="margin: 0px 30px;"><a class="ps-shoe__name" href="product-detail.php?p=<?php echo $s2ProductID; ?>"><?php echo substr($s2ProductTitle, 0, 50); ?></a>
                        <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#">
                          Jordan</a></p> -->
                        <span class="ps-shoe__price"> ₹ <?php echo $s2ProductPrice; ?></span>
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


    <?php if ($homeSection3) { ?>
      <div class="ps-section ps-section--top-sales ps-owl-root pb-5">
        <div class="ps-container">
          <div class="ps-section__header mb-20">
            <div class="row">
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
                <h3 class="ps-section__title1 text-center" data-mask=""><?php echo $section3Title; ?></h3>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                <div class="ps-owl-actions"><a class="ps-prev" href="#"><i class="ps-icon-arrow-right"></i>Prev</a><a class="ps-next" href="#">Next<i class="ps-icon-arrow-left"></i></a></div>
              </div>
            </div>
          </div>
          <div class="ps-section__content">
            <div class="ps-owl--colection owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="30" data-owl-nav="false" data-owl-dots="false" data-owl-item="4" data-owl-item-xs="1" data-owl-item-sm="2" data-owl-item-md="3" data-owl-item-lg="4" data-owl-duration="1000" data-owl-mousedrag="on">


              <?php foreach ($homeSection3 as $key => $getSection3Product) {
                $s3ProductID = $getSection3Product->_id;
                $s3ProductTitle = $getSection3Product->title;
                // $s3ProductSortTitle = $getSection3Product->short_title;
                $s3ProductImage = $getSection3Product->mainImage[0]->location;
                // $s3ProductSize = $getSection3Product->size;
                // $s3ProductPrice = $getSection3Product->price;
                $s3ProductPrice = $getSection3Product->attributes[0]->price;
                $s3otherImages = $getSection3Product->otherImages;
                
                if($getSection3Product->gst){
                  $s3ProductGst = $getSection3Product->gst;
                  $s3ProductPrice = $s3ProductPrice + ($s3ProductPrice * $s3ProductGst) / 100;
                }
              ?>


                <div class="ps-shoes--carousel">
                  <div class="ps-shoe">
                    <div class="ps-shoe__thumbnail">
                      <!-- <div class="ps-badge"><span>New</span></div> -->
                      <!-- <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                      <img src="<?php echo $s3ProductImage; ?>" alt="" height="300" style="width:auto;margin: auto;"><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $s3ProductID; ?>"></a>
                    </div>
                    <div class="ps-shoe__content">
                      <div class="ps-shoe__variants">
                        <div class="ps-shoe__variant normal">
                        <?php foreach ($s3otherImages as $key_oimg2 => $oimg3) { 
                          if($oimg3->location){?>
                            <img src="<?php echo $oimg3->location; ?>" alt="">
                            <?php } } ?>
                        <!-- <img src="<?php echo $s3ProductImage; ?>" alt="">
                        <img src="<?php echo $s3ProductImage; ?>" alt="">
                        <img src="<?php echo $s3ProductImage; ?>" alt="">
                        <img src="<?php echo $s3ProductImage; ?>" alt=""> -->
                        </div>
                        <!-- <select class="ps-rating ps-shoe__rating">
                        <option value="1">1</option>
                        <option value="1">2</option>
                        <option value="1">3</option>
                        <option value="1">4</option>
                        <option value="2">5</option>
                      </select> -->
                      </div>
                      <div class="ps-shoe__detail" style="margin: 0px 30px;"><a class="ps-shoe__name" href="product-detail.php?p=<?php echo $s3ProductID; ?>"><?php echo substr($s3ProductTitle, 0, 50); ?></a>
                        <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#">
                          Jordan</a></p> -->
                        <span class="ps-shoe__price"> ₹ <?php echo $s3ProductPrice; ?></span>
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


    <?php $cc = count($_SESSION['recent_product_id']);
    if ($cc > 0) { ?>
      <div class="ps-section ps-section--top-sales ps-owl-root pb-5">
        <div class="ps-container">
          <div class="ps-section__header mb-20">
            <div class="row">
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 " style="width:100%">
                <h3 class="ps-section__title1 text-center" data-mask="">Recently viewed</h3>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                <div class="ps-owl-actions"><a class="ps-prev" href="#"><i class="ps-icon-arrow-right"></i>Prev</a><a class="ps-next" href="#">Next<i class="ps-icon-arrow-left"></i></a></div>
              </div>
            </div>
          </div>
          <div class="ps-section__content">
            <div class="ps-owl--colection owl-slider" data-owl-auto="true" data-owl-loop="true" data-owl-speed="5000" data-owl-gap="30" data-owl-nav="false" data-owl-dots="false" data-owl-item="4" data-owl-item-xs="1" data-owl-item-sm="2" data-owl-item-md="3" data-owl-item-lg="4" data-owl-duration="1000" data-owl-mousedrag="on">


              <?php 
              $recentViewed = $_SESSION['recent_product_id'];
              foreach ($recentViewed as $key => $recent) {
                $recentProductID = $_SESSION['recent_product_id'][$key];
                $recentProductTitle = $_SESSION['recent_product_name'][$key];
                $recentProductImage = $_SESSION['recent_product_pic'][$key];
                $recentProductPrice = $_SESSION['recent_product_price'][$key];
              ?>


                <div class="ps-shoes--carousel">
                  <div class="ps-shoe">
                    <div class="ps-shoe__thumbnail">
                      <!-- <div class="ps-badge"><span>New</span></div> -->
                      <!-- <a class="ps-shoe__favorite" href="#"><i class="ps-icon-heart"></i></a> -->
                      <img src="<?php echo $recentProductImage; ?>" alt="" height="300" style="width:auto;margin: auto;"><a class="ps-shoe__overlay" href="product-detail.php?p=<?php echo $recentProductID; ?>"></a>
                    </div>
                    <div class="ps-shoe__content">
                      <div class="ps-shoe__variants">
                        <div class="ps-shoe__variant normal"><img src="<?php echo $recentProductImage; ?>" alt=""><img src="<?php echo $recentProductImage; ?>" alt=""><img src="<?php echo $recentProductImage; ?>" alt=""><img src="<?php echo $recentProductImage; ?>" alt=""></div>
                        <!-- <select class="ps-rating ps-shoe__rating">
                        <option value="1">1</option>
                        <option value="1">2</option>
                        <option value="1">3</option>
                        <option value="1">4</option>
                        <option value="2">5</option>
                      </select> -->
                      </div>
                      <div class="ps-shoe__detail" style="margin: 0px 30px;"><a class="ps-shoe__name" href="product-detail.php"><?php echo substr($recentProductTitle, 0, 50); ?></a>
                        <!-- <p class="ps-shoe__categories"><a href="#">Men shoes</a>,<a href="#"> Nike</a>,<a href="#">
                          Jordan</a></p> -->
                        <span class="ps-shoe__price"> ₹ <?php echo $recentProductPrice; ?></span>
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

    <!-- <div id="carousel" class="carousel slide ml-20 mr-20 mb-20 mt-20" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carousel" data-slide-to="0" class="active"></li>
        <li data-target="#carousel" data-slide-to="1"></li>
        <li data-target="#carousel" data-slide-to="2"></li>
      </ol>

      <div class="carousel-inner">

        <div class="item active">
          <img src="https://picsum.photos/900/600?image=1" alt="Slide 1" />
        </div>
        <div class="item">
          <img src="https://picsum.photos/1500/600?image=2" alt="Slide 2" />
        </div>
        <div class="item">
          <img src="https://picsum.photos/1500/600?image=3" alt="Slide 3" />
        </div>
      </div>
      <a href="#carousel" class="left carousel-control" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left"></span>
      </a>
      <a href="#carousel" class="right carousel-control" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right"></span>
      </a>
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
  <!-- <script type="text/javascript" src="plugins/jquery.matchHeight-min.js"></script> -->
  <script type="text/javascript" src="plugins/slick/slick/slick.min.js"></script>
  <script type="text/javascript" src="plugins/elevatezoom/jquery.elevatezoom.js"></script>
  <script type="text/javascript" src="plugins/Magnific-Popup/dist/jquery.magnific-popup.min.js"></script>
  <!-- <script type="text/javascript" src="plugins/jquery-ui/jquery-ui.min.js"></script> -->
  <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAx39JFH5nhxze1ZydH-Kl8xXM3OK4fvcg&amp;region=GB"></script> -->
  <script type="text/javascript" src="plugins/revolution/js/jquery.themepunch.tools.min.js"></script>
  <script type="text/javascript" src="plugins/revolution/js/jquery.themepunch.revolution.min.js"></script>
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.video.min.js"></script> -->
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.slideanims.min.js"></script> -->
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.layeranimation.min.js"></script> -->
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.navigation.min.js"></script> -->
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.parallax.min.js"></script> -->
  <!-- <script type="text/javascript" src="plugins/revolution/js/extensions/revolution.extension.actions.min.js"></script> -->
  <!-- Custom scripts-->
  <script type="text/javascript" src="js/main.js"></script>
  <?php include('script_function.php'); ?>
</body>

</html>