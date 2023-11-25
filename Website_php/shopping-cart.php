<?php


    // <a class="ps-cart-item__close" href="#"></a> 
// include 'config/config.php';
session_start();
echo '<div class="ps-cart__content">';
        for ($i = 0; $i < count($_SESSION['cart_product_id']); $i++) {
        echo '<div class="ps-cart-item">
        
            <div class="ps-cart-item__thumbnail"><a href="product-detail.php"></a><img
                src="'.$_SESSION['cart_product_pic'][$i].'" alt=""></div>
            <div class="ps-cart-item__content"><a class="ps-cart-item__title" href="product-detail.php">'.$_SESSION['cart_product_name'][$i].'</a>
            <p><span>Qty:<i>'.$_SESSION['cart_product_qty'][$i].'</i></span><span>Total:<i>₹'.$_SESSION['cart_product_totalPrice'][$i].'</i></span></p>
            </div>
        </div>';
        }
    echo '</div>
    <div class="ps-cart__total">
    <p>Item Total:<span>₹'.$_SESSION['gtotal'].'</span></p>
    </div>
    <div class="ps-cart__footer"><a class="ps-btn" href="checkout.php">Check out<i class="ps-icon-arrow-left"></i></a></div>';
