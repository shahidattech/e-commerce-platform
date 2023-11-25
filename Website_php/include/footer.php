<!-- <div class="ps-footer bg--cover" data-background="images/background/parallax.jpg"> -->
<div class="ps-footer bg--cover">
  <div class="ps-footer__content">
    <div class="ps-container">
      <div class="row">
        <div class="col-lg-8 col-md-6 col-sm-12 col-xs-12 ">
          <aside class="ps-widget--footer ps-widget--info">
            <header><a class="ps-logo" href="/"><img src="<?php echo $storeGeneralInfo->imageLogo; ?>" alt="" style="border-radius: 50%;"></a>
              <h3 class="ps-widget__title">Office Address</h3>
            </header>
            <footer>
              <p><strong><?php echo $storeGeneralInfo->storePhysicalAddress; ?></strong></p>
              <p>Email: <a href='mailto:<?php echo $storeGeneralInfo->email; ?>'><?php echo $storeGeneralInfo->email; ?></a></p>
              <p>Mobile: <?php echo $storeGeneralInfo->phoneNumber; ?></p>
              <!-- <p>Fax: ++323 32434 5333</p> -->
            </footer>
          </aside>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-4 col-xs-12 ">
          <aside class="ps-widget--footer ps-widget--link">
            <header>
              <h3 class="ps-widget__title">Get Help</h3>
            </header>
            <footer>
              <ul class="ps-list--line">
                <li><a href="order-list.php">My Orders</a></li>
                <!-- <li><a href="#">Shipping and Delivery</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Payment Options</a></li> -->
                <li><a href="about.php">About Us</a></li>
              </ul>
            </footer>
          </aside>
        </div>
        <!-- <div class="col-lg-2 col-md-2 col-sm-4 col-xs-12 ">
              <aside class="ps-widget--footer ps-widget--link">
                <header>
                  <h3 class="ps-widget__title">Products</h3>
                </header>
                <footer>
                  <ul class="ps-list--line">
                    <li><a href="#">Shoes</a></li>
                    <li><a href="#">Clothing</a></li>
                    <li><a href="#">Accessries</a></li>
                    <li><a href="#">Football Boots</a></li>
                  </ul>
                </footer>
              </aside>
            </div> -->
      </div>
    </div>
  </div>
  <div class="ps-footer__copyright">
    <div class="ps-container">
      <div class="row">
        <div class="col-lg-8 col-md-6 col-sm-6 col-xs-12 ">
          <p>&copy; <a href="javascript:void(0);"><?php echo $storeGeneralInfo->brandName; ?></a>, Inc. All rights Resevered. Design by <a href="https://www.myglobalbazar.com" target="_blank"> myglobalbazar.com</a>
          </p>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 ">
          <ul class="ps-social">
            <li><a href="<?php echo $storeGeneralInfo->facebookUrl; ?>" target="_blank"><i class="fa fa-facebook"></i></a></li>
            <!-- <li><a href="<?php echo $storeGeneralInfo->facebookUrl; ?>" target="_blank"><i class="fa fa-google-plus"></i></a></li> -->
            <li><a href="<?php echo $storeGeneralInfo->twitterUrl; ?>" target="_blank"><i class="fa fa-twitter"></i></a></li>
            <li><a href="<?php echo $storeGeneralInfo->instagramUrl; ?>" target="_blank"><i class="fa fa-instagram"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<?php if ($storeGeneralInfo->phoneNumber) { ?>
  <!-- WhatsHelp.io widget -->
  <script type="text/javascript">
    (function() {
      var options = {
        whatsapp: "+91 <?php echo $storeGeneralInfo->phoneNumber; ?>", // WhatsApp number
        call_to_action: "Message us", // Call to action
        button_color: "#FF6550", // Color of button
        position: "right", // Position may be 'right' or 'left'
        order: "whatsapp", // Order of buttons
      };
      var proto = document.location.protocol,
        host = "whatshelp.io",
        url = proto + "//static." + host;
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = url + '/widget-send-button/js/init.js';
      s.onload = function() {
        WhWidgetSendButton.init(host, proto, options);
      };
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    })();
  </script>
  <!-- /WhatsHelp.io widget -->
<?php } ?>
