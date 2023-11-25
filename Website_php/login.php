<!DOCTYPE html>
<!--[if IE 7]><html class="ie ie7"><![endif]-->
<!--[if IE 8]><html class="ie ie8"><![endif]-->
<!--[if IE 9]><html class="ie ie9"><![endif]-->
<html lang="en">
<?php include 'config/config.php'; 
if(!empty($_SESSION['userId'])){
	header("location:index.php");
}
$loginURL="";
$authUrl = $googleClient->createAuthUrl();
$loginURL = filter_var($authUrl, FILTER_SANITIZE_URL);

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
  <title>Login/Regiser</title>
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
    #logreg-forms {
      width: 412px;
      margin: 10vh auto;
      background-color: #f3f3f3;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    }

    #logreg-forms form {
      width: 100%;
      max-width: 410px;
      padding: 15px;
      margin: auto;
    }

    #logreg-forms .form-control {
      position: relative;
      box-sizing: border-box;
      height: auto;
      padding: 10px;
      font-size: 16px;
    }

    #logreg-forms .form-control:focus {
      z-index: 2;
    }

    #logreg-forms .form-signin input[type="email"] {
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    #logreg-forms .form-signin input[type="password"] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    #logreg-forms .social-login {
      width: 390px;
      margin: 0 auto;
      margin-bottom: 14px;
    }

    #logreg-forms .social-btn {
      font-weight: 100;
      color: white;
      /* width: 190px; */
      /* font-size: 0.9rem; */
    }

    #logreg-forms a {
      display: block;
      padding-top: 10px;
      color: lightseagreen;
    }

    #logreg-form .lines {
      width: 200px;
      border: 1px solid red;
    }


    #logreg-forms button[type="submit"] {
      margin-top: 10px;
    }

    #logreg-forms .facebook-btn {
      background-color: #3C589C;
    }

    #logreg-forms .google-btn {
      background-color: #DF4B3B;
    }

    #logreg-forms .form-reset,
    #logreg-forms .form-signup {
      display: none;
    }

    #logreg-forms .form-signup .social-btn {
      width: 210px;
    }

    #logreg-forms .form-signup input {
      margin-bottom: 2px;
    }

    .form-signup .social-login {
      width: 210px !important;
      margin: 0 auto;
    }

    /* Mobile */

    @media screen and (max-width:500px) {
      #logreg-forms {
        width: 300px;
      }

      #logreg-forms .social-login {
        width: 200px;
        margin: 0 auto;
        margin-bottom: 10px;
      }

      #logreg-forms .social-btn {
        font-size: 1.3rem;
        font-weight: 100;
        color: white;
        width: 200px;
        height: 56px;

      }

      #logreg-forms .social-btn:nth-child(1) {
        margin-bottom: 5px;
      }

      #logreg-forms .social-btn span {
        display: none;
      }

      #logreg-forms .facebook-btn:after {
        content: 'Facebook';
      }

      #logreg-forms .google-btn:after {
        content: 'Google+';
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
    <div class="ps-checkout pt-20 pb-80">
      <div class="ps-container">

        <div id="logreg-forms">
          <form class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal" style="text-align: center"> Sign in</h1>
            <div class="social-login text-center">
              <!-- <button class="btn facebook-btn social-btn" type="button"><span><i class="fa fa-facebook-f"></i> Sign in with Facebook</span> </button> -->
              <a href="<?= htmlspecialchars( $loginURL ); ?>" class="btn google-btn social-btn" type="button"><span><i class="fa fa-google-plus"></i> Sign in with Google+</span> </a>
            </div>
            <!-- <p style="text-align:center"> OR </p>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="">
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="">

            <button class="btn btn-success btn-block" type="submit"><i class="fa fa-sign-in"></i> Sign in</button>
            <a href="#" id="forgot_pswd">Forgot password?</a>
            <hr>
            <p>Don't have an account!</p> 
            <button class="btn btn-primary btn-block" type="button" id="btn-signup"><i class="fa fa-user-plus"></i> Sign up New Account</button> -->
          </form>

          <form action="/reset/password/" class="form-reset">
            <input type="email" id="resetEmail" class="form-control" placeholder="Email address" required="" autofocus="">
            <button class="btn btn-primary btn-block" type="submit">Reset Password</button>
            <a href="#" id="cancel_reset"><i class="fa fa-angle-left"></i> Back</a>
          </form>

          <form action="/signup/" class="form-signup">
          <h1 class="h3 mb-3 font-weight-normal" style="text-align: center"> Sign Up</h1>
            <!-- <div class="social-login">
              <button class="btn facebook-btn social-btn" type="button"><span><i class="fa fa-facebook-f"></i> Sign up with Facebook</span> </button>
            </div> -->
            <div class="social-login">
              <button class="btn google-btn social-btn" type="button"><span><i class="fa fa-google-plus"></i> Sign up with Google+</span> </button>
            </div>

            <p style="text-align:center">OR</p>

            <input type="text" id="user-name" class="form-control" placeholder="Full name" required="" autofocus="">
            <input type="email" id="user-email" class="form-control" placeholder="Email address" required autofocus="">
            <input type="password" id="user-pass" class="form-control" placeholder="Password" required autofocus="">
            <input type="password" id="user-repeatpass" class="form-control" placeholder="Repeat Password" required autofocus="">

            <button class="btn btn-primary btn-block" type="submit"><i class="fa fa-user-plus"></i> Sign Up</button>
            <a href="#" id="cancel_signup"><i class="fa fa-angle-left"></i> Back</a>
          </form>
          <br>

        </div>
        <!-- <p style="text-align:center">
          <a href="http://bit.ly/2RjWFMfunction toggleResetPswd(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

function toggleSignUp(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

$(()=>{
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
})g" target="_blank" style="color:black">By Artin</a>
        </p> -->


        <!-- <form class="ps-checkout__form" action="" method="post">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div class="ps-checkout__billing">
                <h3 class="text-center">Login</h3>
                <div class="form-group form-group--inline">
                  <label>Email<span>*</span>
                  </label>
                  <input class="form-control" type="text" name="f_name" required>
                </div>
                <div class="form-group form-group--inline">
                  <label>Password<span>*</span>
                  </label>
                  <input class="form-control" type="text" name="l_name" required>
                </div>
                <button class="ps-btn ps-btn--fullwidth">Login</button>
                <p>Login with</p>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div class="ps-checkout__billing">
                <h3 class="text-center">Registration</h3>
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
                  <label>Email<span>*</span>
                  </label>
                  <input class="form-control" type="text" name="u_email" required>
                </div>
                <div class="form-group form-group--inline">
                  <label>Mobile<span>*</span>
                  </label>
                  <input class="form-control" type="text" name="u_mobile" required>
                </div>
                <div class="form-group form-group--inline">
                  <label>Password<span>*</span>
                  </label>
                  <input class="form-control" type="text" name="u_password" required>
                </div>
                <button class="ps-btn ps-btn--fullwidth">Register</button>
              </div>
            </div>
            
          </div>
        </form> -->
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
    function toggleResetPswd(e) {
      e.preventDefault();
      $('#logreg-forms .form-signin').toggle() // display:block or none
      $('#logreg-forms .form-reset').toggle() // display:block or none
    }

    function toggleSignUp(e) {
      e.preventDefault();
      $('#logreg-forms .form-signin').toggle(); // display:block or none
      $('#logreg-forms .form-signup').toggle(); // display:block or none
    }

    $(() => {
      // Login Register Form
      $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
      $('#logreg-forms #cancel_reset').click(toggleResetPswd);
      $('#logreg-forms #btn-signup').click(toggleSignUp);
      $('#logreg-forms #cancel_signup').click(toggleSignUp);
    })
  </script>
</body>

</html>