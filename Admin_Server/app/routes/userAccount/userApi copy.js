/* global __dirname */
var path = require("path");
const { check } = require('express-validator');
var UserCtrl = require(path.join(__dirname, "..","..", "controllers", "userAccount","userCtrl"));
var jwt = require(path.join(__dirname, "..", "..", "service", "auth", "jwt"));
var UserVld = require(path.join(__dirname, '..', '..', 'validation', 'controller', 'userCtrlVld'));


module.exports = function(app, upload) {
  app.post("/api/v1/user",UserCtrl.existsUser, UserCtrl.createUser);
  app.post("/api/v1/user/updatePassword", jwt.validateToken,UserVld.verifyChangePassword, UserCtrl.updateUserPassword);
  app.post("/api/v1/user/updateProfile",
  [check('payUMerchantKey').isLength({min:1}).withMessage('Please Enter payUMerchantKey'),
  check('payUMerchantKey').isLength({min:1}).withMessage('Please Enter payUMerchantKey'),
  check('payUMerchantKey').isLength({min:1}).withMessage('Please Enter payUMerchantKey')],
  jwt.validateToken, UserCtrl.updateProfile);
};
