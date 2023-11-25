/* global __dirname */
var path = require('path');
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
var CustomerCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'customer', 'customerCtrl'));


module.exports = function(app) {
    app.post('/api/v1/website/customer/login', 
      // userVld.verifyUserSignIn, 
        CustomerCtrl.authenticate
    );

    //Clear user session entry from session db
    app.post('/api/v1/website/user/logout', 
        CustomerCtrl.logout
    );

    //Check if the user token is already expired
    app.get('/api/v1/checkstatus', 
        jwt.checkToken
    );
    // resel password

    //A handler from an email client (gmail, hotmail)
    // app.get('/auth/receiveVerifyPassword', emailVerification.handlerResetPwd);
    //first prompt to send change password link
    // app.post('/user/changePassword', emailVerification.sendResetPwd);
    //actually takes new password and changes in db
   //  app.post('/api/v1/website/user/resetPassword', CustomerCtrl.reset);

    //A handler from an email client (gmail, hotmail)
    // app.get('/auth/verifyEmailAccount', emailVerification.handlerAccountVerify);

    //resend account verification from ui
    // app.post('/user/sendVerifyEmailFromUI', emailVerification.resendAccountVerifyFromUI);

};