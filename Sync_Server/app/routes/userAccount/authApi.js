/* global __dirname */
var path = require('path');
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));

var authCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'userAccount', 'authCtrl'));
var userVld = require(path.join(__dirname, '..', '..', 'validation', 'controller', 'userCtrlVld'));
// var emailVerification = require(path.join(__dirname, '..', '..', 'controllers', 'misc', 'emailCtrl'));
// var passwordReset = require(path.join(__dirname, '..', '..', 'controllers', 'misc', 'passwordCtrl'));

module.exports = function(app) {

    //Authenticate a user with provided username and password
    //Create a user session entry in the session db (Redis)
    //Send JWT back to browser local storage
    app.post('/api/user/login', 
        userVld.verifyUserSignIn, 
        authCtrl.authenticate
    );

    //Clear user session entry from session db
    app.post('/api/user/logout', 
        authCtrl.logout
    );

    //Check if the user token is already expired
    app.get('/checkstatus', 
        jwt.checkToken
    );

    //A handler from an email client (gmail, hotmail)
    // app.get('/auth/receiveVerifyPassword', emailVerification.handlerResetPwd);
    //first prompt to send change password link
    // app.post('/user/changePassword', emailVerification.sendResetPwd);
    //actually takes new password and changes in db
    // app.post('/user/resetPassword', passwordReset.reset);

    //A handler from an email client (gmail, hotmail)
    // app.get('/auth/verifyEmailAccount', emailVerification.handlerAccountVerify);

    //resend account verification from ui
    // app.post('/user/sendVerifyEmailFromUI', emailVerification.resendAccountVerifyFromUI);

};