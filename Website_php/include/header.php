<?php
$categoriesData = getCategories('home', 'getCatSubCatSubSub', $userId);
$allCategories = getSectionData($categoriesData, 'cat_subCat_subSubCat');
$storeGeneralInfo = getSectionData($categoriesData, 'storeGeneralInfo');
// print_r($storeGeneralInfo);
?>
<style>
  .ui-state-active:hover {
    /* color: blue !important; */
  }
</style>

<style>
  form.example input[type=text] {
    padding: 10px;
    font-size: 17px;
    border: 1px solid grey;
    float: left;
    width: 80%;
    background: #f1f1f1;
    color: black;
    border: 1px solid #2ac37d;
    /* margin-bottom: 12px; */
  }

  form.example button {
    float: left;
    width: 20%;
    padding: 10px;
    background: #2ac37d;
    color: white;
    font-size: 17px;
    border: 1px solid grey;
    border-left: none;
    cursor: pointer;
  }

  form.example button:hover {
    background: #2ac37d;
  }

  form.example::after {
    content: "";
    clear: both;
    display: table;
  }
</style>

<div class="header--sidebar"></div>
<header class="header" <?php if($storeGeneralInfo->headerColor){ ?> style="background: <?php echo $storeGeneralInfo->headerColor; ?>" <?php } ?>>
  <div class="header__top">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 col-md-8 col-sm-6 col-xs-12 ">
          <!-- <p><?php //echo $storeGeneralInfo->storePhysicalAddress; ?></p> -->
        </div>
        <div class="col-lg-6 col-md-4 col-sm-6 col-xs-12 ">
          <?php if ($_SESSION['userId']) { ?>
            

            <div class="dropdown" style="float:right;padding: 6px;">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">My Account
                <span class="caret"></span></button>
              <ul class="dropdown-menu">
                <li><a href="order-list.php">My Orders</a></li>
                <li><a href="logout.php">Logout</a></li>
              </ul>
            </div>
            <div class="header__actions" style="padding: 12px;"><b>Welcome,</b> <?php echo $_SESSION['userName']; ?></div>
          <?php } else { ?>
            <div class="header__actions"><a href="login.php">Login/Regiser</a></div>

            

          <?php } ?>
        </div>
      </div>
    </div>
  </div>



  <nav class="navigation">
    <div>
      <form class="example" action="" onsubmit="event.preventDefault();">
        <input type="text" placeholder="Search Product..." id="searchInput" name="search-product" autocomplete="off">
        <input type="hidden" id="userID" name="userID" value="" />
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
    </div>

    <div class="container-fluid" style="border: 1px solid #efefef;">
      <div class="navigation__column left">
        <div class="header__logo"><a class="ps-logo" href="/">
            <!-- <img src="images/logo.png" alt=""> -->
            <img src="<?php echo $storeGeneralInfo->imageLogo; ?>" alt="" style="height: 70px;">
          </a></div>
      </div>
      <div class="navigation__column center">
        <ul class="main-menu menu" id="mygb-category">
          <li class="menu-item"><a href="/">Home</a></li>

          <?php foreach ($allCategories as $main_key => $main_cat) { ?>

            <li class="menu-item menu-item-has-children has-mega-menu"><a href="product-listing.php?c=<?php echo $main_cat->categoryId; ?>"><?php echo $main_cat->categoryName; ?></a>
              <div class="mega-menu">
                <div class="mega-wrap">

                  <?php foreach ($main_cat->sub_categories as $sub_key => $sub_cat) {  ?>
                    <div class="mega-column">
                      <a href="product-listing.php?s=<?php echo $sub_cat->subCategoryId; ?>">
                        <h4 class="mega-heading"><?php echo $sub_cat->subCategoryName; ?></h4>
                      </a>
                      <ul class="mega-item">
                        <?php foreach ($sub_cat->sub_sub_categories as $sub_sub_key => $sub_sub_cat) {  ?>
                          <li><a href="product-listing.php?ss=<?php echo $sub_sub_cat->subSubCategoryId; ?>"><?php echo $sub_sub_cat->subSubCategoryName; ?></a></li>
                        <?php } ?>
                      </ul>
                    </div>
                  <?php } ?>

                </div>
              </div>
            </li>

          <?php } ?>


          <!-- <li class="menu-item menu-item-has-children has-mega-menu"><a href="#">Men</a>
              <div class="mega-menu">
                <div class="mega-wrap">
                  <div class="mega-column">
                    <h4 class="mega-heading">Shoes</h4>
                    <ul class="mega-item">
                      <li><a href="product-listing.php">All Shoes</a></li>
                      <li><a href="product-listing.php">Running</a></li>
                      <li><a href="product-listing.php">Training & Gym</a></li>
                      <li><a href="product-listing.php">Basketball</a></li>
                      <li><a href="product-listing.php">Football</a></li>
                      <li><a href="product-listing.php">Soccer</a></li>
                      <li><a href="product-listing.php">Baseball</a></li>
                    </ul>
                  </div>
                  <div class="mega-column">
                    <h4 class="mega-heading">CLOTHING</h4>
                    <ul class="mega-item">
                      <li><a href="product-listing.php">Compression & Nike Pro</a></li>
                      <li><a href="product-listing.php">Tops & T-Shirts</a></li>
                      <li><a href="product-listing.php">Polos</a></li>
                      <li><a href="product-listing.php">Hoodies & Sweatshirts</a></li>
                      <li><a href="product-listing.php">Jackets & Vests</a></li>
                      <li><a href="product-listing.php">Pants & Tights</a></li>
                      <li><a href="product-listing.php">Shorts</a></li>
                    </ul>
                  </div>
                  <div class="mega-column">
                    <h4 class="mega-heading">Accessories</h4>
                    <ul class="mega-item">
                      <li><a href="product-listing.php">Compression & Nike Pro</a></li>
                      <li><a href="product-listing.php">Tops & T-Shirts</a></li>
                      <li><a href="product-listing.php">Polos</a></li>
                      <li><a href="product-listing.php">Hoodies & Sweatshirts</a></li>
                      <li><a href="product-listing.php">Jackets & Vests</a></li>
                      <li><a href="product-listing.php">Pants & Tights</a></li>
                      <li><a href="product-listing.php">Shorts</a></li>
                    </ul>
                  </div>
                  <div class="mega-column">
                    <h4 class="mega-heading">BRAND</h4>
                    <ul class="mega-item">
                      <li><a href="product-listing.php">NIKE</a></li>
                      <li><a href="product-listing.php">Adidas</a></li>
                      <li><a href="product-listing.php">Dior</a></li>
                      <li><a href="product-listing.php">B&G</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </li> -->
          <!-- <li class="menu-item"><a href="#">Women</a></li>
            <li class="menu-item"><a href="#">Kids</a></li> -->
        </ul>
      </div>

      <div class="navigation__column right">
        <!-- <form class="ps-search--header" action="" method="post">
          <input class="form-control" type="text" id="searchInput" placeholder="Search Product…" autocomplete="off">

          <input type="hidden" id="userID" name="userID" value="" />
          <button><i class="ps-icon-search"></i></button>
        </form> -->
        <div class="ps-cart"><a class="ps-cart__toggle" href="cart.php"><span><i id="total_cart_item">0</i></span><i class="ps-icon-shopping-cart"></i></a>
          <div class="ps-cart__listing" id="shoppingCart__listing">
            <!-- <div class="ps-cart__content">
                <div class="ps-cart-item"><a class="ps-cart-item__close" href="#"></a>
                  <div class="ps-cart-item__thumbnail"><a href="product-detail.php"></a><img
                      src="images/cart-preview/1.jpg" alt=""></div>
                  <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="product-detail.php">Amazin’
                      Glazin’</a>
                    <p><span>Quantity:<i>12</i></span><span>Total:<i>£176</i></span></p>
                  </div>
                </div>
                <div class="ps-cart-item"><a class="ps-cart-item__close" href="#"></a>
                  <div class="ps-cart-item__thumbnail"><a href="product-detail.php"></a><img
                      src="images/cart-preview/2.jpg" alt=""></div>
                  <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="product-detail.php">The
                      Crusty Croissant</a>
                    <p><span>Quantity:<i>12</i></span><span>Total:<i>£176</i></span></p>
                  </div>
                </div>
                <div class="ps-cart-item"><a class="ps-cart-item__close" href="#"></a>
                  <div class="ps-cart-item__thumbnail"><a href="product-detail.php"></a><img
                      src="images/cart-preview/3.jpg" alt=""></div>
                  <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="product-detail.php">The
                      Rolling Pin</a>
                    <p><span>Quantity:<i>12</i></span><span>Total:<i>£176</i></span></p>
                  </div>
                </div>
              </div>
              <div class="ps-cart__total">
                <p>Number of items:<span>36</span></p>
                <p>Item Total:<span>£528.00</span></p>
              </div>
              <div class="ps-cart__footer"><a class="ps-btn" href="#">Check out<i
                    class="ps-icon-arrow-left"></i></a></div> -->
          </div>
        </div>
        <div class="menu-toggle"><span></span></div>
      </div>

      <!-- <div>
        <form class="example" action="" onsubmit="event.preventDefault();">
          <input type="text" placeholder="Search Product..." id="searchInput" name="search-product" autocomplete="off">
          <input type="hidden" id="userID" name="userID" value="" />
          <button type="submit"><i class="fa fa-search"></i></button>
        </form>
      </div> -->


    </div>
  </nav>
</header>