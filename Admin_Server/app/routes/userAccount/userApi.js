/* global __dirname */
const { check } = require('express-validator');
var Path = require("path");
var UserCtrl = require(Path.join(
  __dirname,
  "..",
  "..",
  "controllers",
  "userAccount",
  "userCtrl"
));
var UserVld = require(Path.join(
  __dirname,
  "..",
  "..",
  "validation",
  "controller",
  "userCtrlVld"
));
var jwt = require(Path.join(__dirname, "..", "..", "service", "auth", "jwt"));
// var Util = require(Path.join(__dirname, '..', '..', 'controllers', 'misc', 'utilCtrl'));
var feature = require("../../service/auth/featureChecker");

module.exports = function(app, upload) {
  app.post(
    "/api/v1/user",
    UserCtrl.existsUser,
    // emailCtrl.sendAccountVerify,
    UserCtrl.createUser
    // UserVld.verifyCreateUser
    // message.setInitialMessages
  );
  app.post("/api/v1/user/updateProfile",
  jwt.validateToken, UserCtrl.updateProfile);

  app.post(
    "/api/v1/subscriber",
    UserCtrl.existsSubscriber,
    // emailCtrl.sendAccountVerify,
    UserCtrl.createSubscriber
    // UserVld.verifyCreateUser
    // message.setInitialMessages
  );
  app.post(
    "/api/v1/user" + "updateusers",
    upload.fields([{ name: "user_photos", maxCount: 1 }]),
    UserCtrl.updateusers
  );
  app.get("/api/v1/user/:id/userinfo", UserCtrl.getProfileInfo);
  app.get("/api/v1/user/:id/userAccountSettings", UserCtrl.userAccountSettings);
  app.get('/api/v1/user/getCustomersBySellerID', UserCtrl.getCustomersBySellerID);
  app.get('/api/v1/user/getdashBoardDataBySellerID', UserCtrl.getdashBoardDataBySellerID);
  app.get("/api/v1/alluserdetails", UserCtrl.userallDetails);
  // get user details
  app.post("/api/v1/users/getByIds", UserCtrl.getUsersByIds);
  // update user details
  app.post(
    "/api/v1/user/" + "updateusers/:id",
    jwt.validateToken,
    UserCtrl.userUpdate,
   //UserVld.verifyChangePassword,
    UserCtrl.updateUserPassword
  );
  app.post(
    "/api/v1/user/updatePassword",
    // jwt.validateToken,
    // UserVld.verifyChangePassword,
    UserCtrl.updateUserPassword
  );
  app.post(
    "/api/v1/user/updateAvatar",
    jwt.validateToken,
    UserCtrl.updateAvatar
  );
  // search users
  app.get("/api/v1/user/search/:searchText", UserCtrl.getUsers);
  //get all users Except One By Id
  app.get(
    "/api/v1/user/:id/getallusersexceptbyid",
    UserCtrl.getAllUsersExceptOneById
  );

  app.get("/api/v1/user/getRoles", UserCtrl.getUserRoles);
};
