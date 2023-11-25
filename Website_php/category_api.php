<?php 

include_once('config/config.php');
$allCategories = getCategories('home', 'getCatSubCatSubSub', $userId);
echo '<li class="menu-item"><a href="/">Home</a></li>

<?php foreach ($allCategories as $main_key => $main_cat) { ?>
  
  <li class="menu-item menu-item-has-children has-mega-menu"><a href="#"><?php echo $main_cat->categoryName; ?></a>
    <div class="mega-menu">
      <div class="mega-wrap">

      <?php foreach ($main_cat->sub_categories as $sub_key => $sub_cat) {  ?>
        <div class="mega-column">
          <a href="product-listing.php?s=<?php echo $sub_cat->subCategoryId; ?>"><h4 class="mega-heading"><?php echo $sub_cat->subCategoryName; ?></h4></a>
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

<?php } ?>';