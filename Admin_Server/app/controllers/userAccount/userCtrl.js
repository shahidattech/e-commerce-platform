/* global __dirname */
var _ = require("lodash");
var logger = require('logger').createLogger();
var mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
var User = mongoose.model("User");
var payUpaymentKeysModel = mongoose.model("paymentKeysModel");
var razorPaypaymentKeysModel = mongoose.model("razorPaypaymentKeysModel");
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var SubscriberModel = mongoose.model("SubscriberModel");
var customerModel = require('mongoose').model('customerModel');
var productModel = require('mongoose').model('Product');
var orderModel = require('mongoose').model('orderModel');
var statisticsModel = require('mongoose').model('statisticsModel');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const moment = require('moment-timezone');

// var Project = mongoose.model('Projects');
var fs = require("fs");
var path = require("path");
var Restify = require("restify");
var url = require('url');
var Joi = require("joi");
var async = require("async");
const { validationResult } = require('express-validator');
var check = require(path.join(__dirname, "..", "..", "service", "util", "checkValidObject"));

var encrypt = require(path.join(
  __dirname,
  "..",
  "..",
  "service",
  "util",
  "encryption"
));
var userRoles = require("../../config/userRoles.json");

var defaultFeatureList = require(path.join(
  __dirname,
  "..",
  "..",
  "data",
  "userFeatureList"
)).defaultUserRoleFeatures;


//Helper functions
function InitializeUser(data) {
  var randomSalt = encrypt.createSalt();
  var userData = {
    profile: {
      firstName: data.firstName,
      lastName: data.lastName
    },
    fullName: data.fullName,
    userName: data.userName,
    phoneNo: data.phoneNo,
    salt: randomSalt,
    hashedPwd: encrypt.hashPwd(randomSalt, data.passwd),
    dateOfRegistration: new Date(),
    userRole: 'user',
    active: true
  };

  if (data.provider) {
    userData.scKey = data.scKey;
    userData.scHash = encrypt.hashPwd(randomSalt, data.uid + "_" + data.scKey);
    userData.scProvider = data.provider;
    //userData.active = data.active;
  }
  return userData;
}

// create new user
exports.createUser = function (req, res, next) {
  //get client data
  var userData = req.body;
  //initialize basic user
  var user = InitializeUser(userData);

  User.create(user, createUserCallback);
  function createUserCallback(err, base) {
    if (err) {
      return next(new Restify.errors.InternalServerError(err, "hello"));
      console.log(err);
    }
    req.userId = base._id;
    res.status(200);
    res.send(true);
    next();
  }
};

//Update User/Store Profiles

exports.updateProfile = function (req, res) {
  console.log('req body=', req.body);
  try {
    let updateProfile_resp = {};
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      updateProfile_resp.status = 422;
      updateProfile_resp.data = errors;
      res.status(422);
      res.send(updateProfile_resp);
    }
    else {
      if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body["key_id"]) && !check.isUndefinedOrNullOrEmptyOrNoLen(req.body["key_secret"])) {
        updateRazorPayKey(req.body["userId"], req.body["key_id"], req.body["key_secret"], function (result) {
          payUpaymentKeysModel.findById({ _id: req.body["userId"] },
            function (err, result) {
              if (err) {
                updateProfile_resp.status = 500;
                updateProfile_resp.data = 'Error while checking the  Payment Keys';
                res.status(500);
                res.send(updateProfile_resp);
              }
              else {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                  //Keys are present
                  updateUserModel(req.body["userId"], req.body["themeOption"], req.body["websiteURL"], function (result) {
                    if (result) {
                      updateCommonDataInHome(req.body, function (result) {
                        console.log('128', result);
                        if (result) {
                          updateProfile_resp.status = 200;
                          updateProfile_resp.data = 'Successfully updated Keys, user details and common information';
                          res.status(200);
                          res.send(updateProfile_resp);
                        }
                        else {
                          updateProfile_resp.status = 200;
                          updateProfile_resp.data = 'Failed to update common information for the Wesite';
                          res.status(200);
                          res.send(updateProfile_resp);
                        }
                      });
                    }
                    else {
                      updateProfile_resp.status = 500;
                      updateProfile_resp.data = 'Failed to update user Data for theme and websiteURL';
                      res.status(500);
                      res.send(updateProfile_resp);
                    }
                  });
                }
                else {
                  let paymentKeysModelObj = new payUpaymentKeysModel();
                  paymentKeysModelObj._id = req.body["userId"];
                  paymentKeysModelObj.payUMerchantKey = req.body["payUMerchantKey"];
                  paymentKeysModelObj.payUMerchantSalt = req.body["payUMerchantSalt"];
                  paymentKeysModelObj.payUMerchantHeader = req.body["payUMerchantHeader"];
                  paymentKeysModelObj.save(function (err, result) {
                    if (err) {
                      updateProfile_resp.status = 500;
                      updateProfile_resp.data = 'Failed to update Payment Keys';
                      res.status(500);
                      res.send(updateProfile_resp);
                    }
                    else {
                      //Keys are present
                      updateUserModel(req.body["userId"], req.body["themeOption"], req.body["websiteURL"], function (result) {
                        if (result) {
                          updateCommonDataInHome(req.body, function (result) {
                            if (result) {
                              updateProfile_resp.status = 200;
                              updateProfile_resp.data = 'Successfully updated Keys, user details and common information';
                              res.status(200);
                              res.send(updateProfile_resp);
                            }
                            else {
                              updateProfile_resp.status = 200;
                              updateProfile_resp.data = 'Failed to update common information for the Wesite';
                              res.status(200);
                              res.send(updateProfile_resp);
                            }
                          });
                        }
                        else {
                          updateProfile_resp.status = 500;
                          updateProfile_resp.data = 'Failed to update user Data for theme and websiteURL';
                          res.status(500);
                          res.send(updateProfile_resp);
                        }
                      });
                    }
                  });
                }
              }
            });
        });
      }
      else {
        payUpaymentKeysModel.findById({ _id: req.body["userId"] },
          function (err, result) {
            if (err) {
              updateProfile_resp.status = 500;
              updateProfile_resp.data = 'Error while checking the  Payment Keys';
              res.status(500);
              res.send(updateProfile_resp);
            }
            else {
              if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                //Keys are present
                updateUserModel(req.body["userId"], req.body["themeOption"], req.body["websiteURL"], function (result) {
                  if (result) {
                    updateCommonDataInHome(req.body, function (result) {
                      console.log('128', result);
                      if (result) {
                        updateProfile_resp.status = 200;
                        updateProfile_resp.data = 'Successfully updated Keys, user details and common information';
                        res.status(200);
                        res.send(updateProfile_resp);
                      }
                      else {
                        updateProfile_resp.status = 200;
                        updateProfile_resp.data = 'Failed to update common information for the Wesite';
                        res.status(200);
                        res.send(updateProfile_resp);
                      }
                    });
                  }
                  else {
                    updateProfile_resp.status = 500;
                    updateProfile_resp.data = 'Failed to update user Data for theme and websiteURL';
                    res.status(500);
                    res.send(updateProfile_resp);
                  }
                });
              }
              else {
                let paymentKeysModelObj = new payUpaymentKeysModel();
                paymentKeysModelObj._id = req.body["userId"];
                paymentKeysModelObj.payUMerchantKey = req.body["payUMerchantKey"];
                paymentKeysModelObj.payUMerchantSalt = req.body["payUMerchantSalt"];
                paymentKeysModelObj.payUMerchantHeader = req.body["payUMerchantHeader"];
                paymentKeysModelObj.save(function (err, result) {
                  if (err) {
                    updateProfile_resp.status = 500;
                    updateProfile_resp.data = 'Failed to update Payment Keys';
                    res.status(500);
                    res.send(updateProfile_resp);
                  }
                  else {
                    //Keys are present
                    updateUserModel(req.body["userId"], req.body["themeOption"], req.body["websiteURL"], function (result) {
                      if (result) {
                        updateCommonDataInHome(req.body, function (result) {
                          if (result) {
                            updateProfile_resp.status = 200;
                            updateProfile_resp.data = 'Successfully updated Keys, user details and common information';
                            res.status(200);
                            res.send(updateProfile_resp);
                          }
                          else {
                            updateProfile_resp.status = 200;
                            updateProfile_resp.data = 'Failed to update common information for the Wesite';
                            res.status(200);
                            res.send(updateProfile_resp);
                          }
                        });
                      }
                      else {
                        updateProfile_resp.status = 500;
                        updateProfile_resp.data = 'Failed to update user Data for theme and websiteURL';
                        res.status(500);
                        res.send(updateProfile_resp);
                      }
                    });
                  }
                });
              }
            }
          });
      }

    }

  } catch (error) {
    let updateProfile_resp = {};
    logger.error('Error occurred while update userProfile and Payukeys');
    updateProfile_resp.status = 500;
    updateProfile_resp.data = 'Internal Server Error';
    res.status(500);
    res.send(updateProfile_resp);
  }
}

function updateRazorPayKey(userId, key_id, key_secret,  callback){
  try {
    razorPaypaymentKeysModel.findById({ _id:userId }, function(err, result){
      if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
        callback(true);
      }
      else{
        let razorPaypaymentKeysModelObj = new razorPaypaymentKeysModel();
        razorPaypaymentKeysModelObj._id = userId;
        razorPaypaymentKeysModelObj.key_id = key_id;
        razorPaypaymentKeysModelObj.key_secret = key_secret;
        razorPaypaymentKeysModelObj.save(function(err, result){
          if(!check.isUndefinedOrNullOrEmptyOrNoLen(err)){
            callback(false);
          }
          else{
            callback(true);
          }
        })
      }
    })
  } catch (error) {
    logger.error('Error occurred while updating razorpay keys');
    callback(false);
  }
}


function updateUserModel(userId, theme, websiteURL, callback) {
  try {
    User.findById({ _id: userId }, function (err, result) {
      if (err) {
        callback(false);
      }
      else {
        result.themeOption = theme;
        result.websiteURL = websiteURL;
        result.save(function (err, result) {
          if (err) {
            callback(false);
          }
          else {
            callback(true);
          }
        });
      }
    });
  } catch (error) {
    logger.error('Error in updateUserModel::', error);
    callback(false);
  }
}

function updateCommonDataInHome(data, callback) {
  try {
    let storeGeneralInfo = {
      brandName: data["brandName"],
      facebookUrl: data["facebookUrl"],
      instagramUrl: data["instagramUrl"],
      twitterUrl: data["twitterUrl"],
      phoneNumber: data["phoneNumber"],
      whatsApp: data["whatsApp"],
      email: data["email"],
      pinCode:data["pinCode"],
      state:data["state"],
      storePhysicalAddress: data["storePhysicalAddress"],
      gstNo: data["gstNo"],
      panNo: data["panNo"],
      cin: data["cin"],
      enableForCOD: data["enableForCOD"],
      enableForOnlinePayment: data["enableForOnlinePayment"],
      onlinePaymentMethod: data["onlinePaymentMethod"],
      enableForEmailNotificationonOrder: data["enableForEmailNotificationonOrder"],
      enableForSMSNotificationonOrder: data["enableForSMSNotificationonOrder"],
      enableForSMSNotificationonDispatch: data["enableForSMSNotificationonDispatch"],
      enableForShippingChargesCollect: data["enableForShippingChargesCollect"],
      orderTemplate: data["orderTemplate"],
      aboutUs: data["aboutUs"],
      headerColor: data["headerColor"],
      imageLogo: data["imageLogo"],
      googlePayNo: data["googlePayNo"],
      phonePayNo: data["phonePayNo"],
      paytmNo: data["paytmNo"]
    };

    homeConfigTheme1Model.findByIdAndUpdate({ _id: data["userId"] },
      { $set: { "storeGeneralInfo": storeGeneralInfo } }, function (err, result) {
        if (err) {
          callback(false);
        }
        else {
          if (check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
            let homeConfigTheme1ModelObj = new homeConfigTheme1Model();
            homeConfigTheme1ModelObj._id = data["userId"];
            homeConfigTheme1ModelObj.storeGeneralInfo = storeGeneralInfo;
            homeConfigTheme1ModelObj.save(function (err, result) {
              if (err) {
                callback(false);
              }
              else {
                callback(true);
              }
            });
          }
          else {
            callback(true);
          }
        }
      });
  } catch (error) {
    logger.error("Error in updateCommonDataInHome::", error);
    callback(false);
  }

}

exports.getdashBoardDataBySellerID = function (req, res) {
  let getdashBoardDataBySellerID_resp = {};
  try {
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    let sellerId = params.userId;
    var statisticsModel = require('mongoose').model('statisticsModel');
    let today = new Date();
    let dateKey = today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString();
    statisticsModel.findOne({ _id: sellerId, "stat.currentDate": dateKey },
      function (err, result) {
        if (err) {
          getdashBoardDataBySellerID_resp.status = 500;
          getdashBoardDataBySellerID_resp.data = 'Error';
          res.send(getdashBoardDataBySellerID_resp);
        }
        else {
          if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
            getdashBoardDataBySellerID_resp.status = 200;
            console.log('stat=', result["stat"][0])
            result["stat"].forEach(statofTheDay => {
              if (statofTheDay["currentDate"] == dateKey) {
                getdashBoardDataBySellerID_resp.data = statofTheDay;
                res.send(getdashBoardDataBySellerID_resp);
              }
            });
          }
          else {
            getdashBoardDataBySellerID_resp.status = 418;
            getdashBoardDataBySellerID_resp.data = 'No Data';
            res.send(getdashBoardDataBySellerID_resp);
          }
        }
      });

  } catch (error) {
    console.log('ee', error)
    getdashBoardDataBySellerID_resp.status = 500;
    getdashBoardDataBySellerID_resp.data = 'Error';
    res.send(getdashBoardDataBySellerID_resp);
  }
}

// create new subscriber
exports.createSubscriber = function (req, res, next) {
  console.log("createSubscriber called");
  //get client data
  var userData = req.body;
  console.log("userData", user);
  //initialize basic user
  var user = InitializeUser(userData);
  console.log("user", user);

  SubscriberModel.create(user, createUserCallback);
  console.log("user", user);
  function createUserCallback(err, base) {
    console.log("createUserCallback called");
    if (err) {
      return next(new Restify.errors.InternalServerError(err, "hello"));
      console.log(err);
    }
    console.log("base");
    req.userId = base._id;
    res.status(200);
    res.send(true);
    next();
  }
};
exports.updateusers = function (req, res, next) {
  //  jwt.validateToken;
  //featureChecker.hasAccessToFeatureNew;
  var userData = req.body;
  console.log(req.files);
  var id = userData._id;
  // var sliderImg = userData.sliderImg;
  // var paragraph_img = userData.paragraph_img;
  console.log(
    "Creating Article Data with",
    userData,
    "---------------------\n"
  );
  if (!User)
    return next(
      new restify.errors.InternalServerError("Model instance(s) is not defined")
    );
  // Verify Article Data----To be Done
  //articleUtil.verifyuserData(req, res, next, insertClassuserData);
  // var formatteduserData = formatuserData();
  // console.log(formatuserData);
  User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userData._id) },
    { $push: { files: req.files } }
  ).exec(function (err, th) {
    // console.log(insertedEvent);
    if (err) {
      return next(new restify.errors.InternalServerError(err));
    } else {
      res.status(200);
      res.send("Users Created");
      next();
    }
  });
};

// check if user already exists
exports.existsUser = function (req, res, next) {
  console.log("existsUser called");
  // check if user model undefined
  if (!User) {
    return next(
      new Restify.errors.InternalServerError(
        "User model instance is not defined -- existing user check"
      )
    );
  }

  // email validation
  Joi.validate(
    { userName: req.body.userName },
    {
      userName: Joi.string()
        .label("User name")
        .email()
        .max(100)
    },
    isValidEmail
  );

  // callback for email validation check
  function isValidEmail(err, user) {
    // in case of invalid email, throw back error to the client
    if (err) {
      return next(new Restify.InvalidArgumentError("Invalid Email provided"));
    }

    // if email format seems ok, then proceeding to duplicate check
    checkIfEmailPreviouslyRegistered();
  }

  //function to check if email id has already been used to create an account earlier
  function checkIfEmailPreviouslyRegistered() {
    // checking in database for users with the same email id as provided by user
    User.findOne({ userName: req.body.userName })
      .select(" _id active ")
      .exec(function (err, userInfo) {
        console.log(
          "checkIfEmailPreviouslyRegistered userName",
          req.body.userName
        );
        console.log("checkIfEmailPreviouslyRegistered userInfo", userInfo);
        if (err) {
          return next(new Restify.errors.InternalServerError(err));
        } else {
          if (check.isUndefinedOrNull(userInfo)) {
            return next();
          }

          // if more than zero documents match the email id that the user provided
          // then throw error back to user saying that email already used
          if (userInfo.active) {
            console.log("userInfo.active", userInfo.active);
            return next(
              new Restify.errors.ForbiddenError({
                message: {
                  text: "Email Id already registered",
                  field: "userName",
                  metadata: req.body,
                  userId: req.userId
                }
              })
            );
          } else {
            return next(
              new Restify.errors.ForbiddenError({
                message: {
                  text: "User Account is not activated",
                  field: "userName",
                  extra: { isDuplicate: true },
                  metadata: req.body,
                  userId: req.userId
                }
              })
            );
          }
        }
      });
  }
};

// check if subscriber already exists
exports.existsSubscriber = function (req, res, next) {
  console.log("existsSubscriber called", req.body);

  // check if user model undefined
  if (!SubscriberModel) {
    return next(
      new Restify.errors.InternalServerError(
        "User model instance is not defined -- existing user check"
      )
    );
  }

  // email validation
  Joi.validate(
    { userName: req.body.userName },
    {
      userName: Joi.string()
        .label("User name")
        .email()
        .max(100)
    },
    isValidEmail
  );

  // callback for email validation check
  function isValidEmail(err, user) {
    // in case of invalid email, throw back error to the client
    if (err) {
      return next(new Restify.InvalidArgumentError("Invalid Email provided"));
    }

    // if email format seems ok, then proceeding to duplicate check
    checkIfEmailPreviouslyRegistered();
  }

  //function to check if email id has already been used to create an account earlier
  function checkIfEmailPreviouslyRegistered() {
    console.log("checkIfEmailPreviouslyRegistered called");
    // checking in database for users with the same email id as provided by user
    SubscriberModel.findOne({ userName: req.body.userName })
      .select(" _id active ")
      .exec(function (err, userInfo) {
        if (err) {
          return next(new Restify.errors.InternalServerError(err));
        } else {
          if (check.isUndefinedOrNull(userInfo)) {
            console.log("userInfo", userInfo);
            return next();
          }

          // if more than zero documents match the email id that the user provided
          // then throw error back to user saying that email already used
          if (userInfo.active) {
            return next(
              new Restify.errors.ForbiddenError({
                message: {
                  text: "Email Id already registered",
                  field: "userName",
                  metadata: req.body,
                  userId: req.userId
                }
              })
            );
          } else {
            return next(
              new Restify.errors.ForbiddenError({
                message: {
                  text: "User Account is not activated",
                  field: "userName",
                  extra: { isDuplicate: true },
                  metadata: req.body,
                  userId: req.userId
                }
              })
            );
          }
        }
      });
  }
};

// check if user already exists
exports.getUsers = function (req, res, next) {
  // check if user model undefined
  if (!User || !Project) {
    return next(
      new Restify.errors.InternalServerError(
        "User and Project model instance is not defined -- existing user check"
      )
    );
  }

  var query = {};

  if (req.params.searchText) {
    var regex = new RegExp(req.params.searchText);
    query = {
      $or: [
        { userName: regex },
        { "profile.firstName": regex },
        { "profile.lastName": regex }
      ]
    };
  }

  User.find(query)
    .limit(10)
    .select("_id userName profile")
    .lean()
    .exec(function (err, data) {
      res.status(200);
      res.send(data);
      next();
    });
};

exports.updateUserPassword = function (req, res, next) {
  var randomSalt = encrypt.createSalt();

  function checkPassword(incomingPassword, user) {
    return encrypt.hashPwd(user.salt, incomingPassword) === user.hashedPwd;
  }

  User.findById(req.userId, "salt hashedPwd", getUserSaltAndPasswdCallback);

  function getUserSaltAndPasswdCallback(err, user) {
    console.log('getUserSaltAndPasswdCallback user', user)
    if (err) {
      return next(new Restify.errors.InternalServerError(err));
    } else {
      // if (!user || !checkPassword(req.body.currentPassword, user)) {
      //   return next(
      //     new Restify.errors.InvalidArgumentError("Incorrect Password")
      //   );
      // }
      User.findByIdAndUpdate(
        req.userId,
        {
          salt: randomSalt,
          hashedPwd: encrypt.hashPwd(randomSalt, req.body.passwd2)
        },
        {
          upsert: true
        }
      ).exec(function (err, document) {
        if (err) {
          return next(new Restify.errors.InternalServerError(err));
        } else {
          res.status(200);
          res.send(true);
          next();
        }
      });
    }
  }
};

exports.updateAvatar = function (req, res, next) {
  var updateQuery = {};

  if (req.body.isCoverImg) {
    updateQuery = {
      "profile.coverName": req.body.coverName,
      "profile.coverVerticalOffset": req.body.coverVerticalOffset
    };
  } else {
    updateQuery = {
      "profile.pictureName": req.body.pictureName
    };
  }

  async.parallel(
    {
      updateUserModel: function (callback) {
        setTimeout(function () {
          updateUserProfileImg(callback);
        }, 200);
      },
      updatePersonModel: function (callback) {
        setTimeout(function () {
          updatePersonProfileImg(callback);
        }, 200);
      }
    },
    function (err, results) {
      if (err) {
        return next(new Restify.errors.InternalServerError(err));
      }
      res.status(200);
      res.send(true);
      next();
    }
  );

  function updateUserProfileImg(callback) {
    User.findByIdAndUpdate(req.userId, updateQuery).exec(function (err, user) {
      if (err) {
        return callback(err);
      }

      callback(null);
    });
  }

  function updatePersonProfileImg(callback) {
    var personModel = req.userRole == "teacher" ? Teacher : Student;

    personModel
      .findByIdAndUpdate(req.userId, updateQuery)
      .exec(function (err, teacher) {
        if (err) {
          return callback(err);
        }

        callback(null);
      });
  }
};
exports.userUpdate = function (req, res, next) {
  console.log("userUpdate called id", req.params.id);
  console.log('req.body', req.body)
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (
    err,
    user
  ) {
    console.log(err, user);
    if (err) {
      return next(new Restify.errors.InternalServerError(err));
    }
    res.status(200);
    res.send("User updated");
    next();
  });
};
exports.updateUserProfile = function (req, res, next) {
  var updateQuery = _.mapKeys(req.body, function (value, key) {
    return "profile." + key;
  });
  console.log(req.userId);
  User.findByIdAndUpdate(req.userId, updateQuery).exec(function (err, user) {
    console.log(err, user);
    if (err) {
      return next(new Restify.errors.InternalServerError(err));
    }
    res.status(200);
    res.send(true);
    next();
  });
};

exports.updateUserLoginActivity = function (req, res, next) {
  var updateQuery = {
    "activity.lastLogin": new Date().toISOString()
  };

  var personModel = req.userRole == "teacher" ? Teacher : Student;

  personModel
    .findByIdAndUpdate(req.userId, updateQuery)
    .exec(function (err, teacher) {
      if (err) {
        il.logInternalExcep(
          "Error in login activity update",
          "userCtrl.updateUserLoginActivity",
          { reqBody: req.body, userId: req.userId }
        );
      }

      next();
    });
};


exports.getProfileInfo = function (req, res, next) {
  console.log('getProfileInfo', req.params.id)
  User.findOne({ _id: req.params.id }, function (err, data) {
    console.log('dadadada', data)
    if (err) {
      res.json(err);
      return next(new Restify.errors.InternalServerError(err));
    } else {
      res.status(200);
      res.send(data);
    }
  });
};

exports.userAccountSettings = function (req, res) {
  let reuserAccountSettings_resp = {};
  try {
    User.findById({ _id: req.params.id }, function (err, result) {
      if (err) {
        reuserAccountSettings_resp.status = 500;
        reuserAccountSettings_resp.data = 'Error occurred while fetching the account details';
        res.send(reuserAccountSettings_resp)
      }
      else {
        let userModelData = {
          "fullName": result["fullName"],
          "accountEmail": result["userName"],
          "websiteURL": result["websiteURL"]
        };
        reuserAccountSettings_resp.userModelData = userModelData;
        homeConfigTheme1Model.findById({ _id: req.params.id }, function (err, result) {
          if (err) {
            reuserAccountSettings_resp.status = 500;
            reuserAccountSettings_resp.data = 'Error occurred while fetching storeGeneralInfo';
            res.send(reuserAccountSettings_resp);
          }
          else {
            if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
              reuserAccountSettings_resp.storeGeneralInfo = result['storeGeneralInfo'];
              payUpaymentKeysModel.findById({ _id: req.params.id }, function (err, result) {
                if (err) {
                  reuserAccountSettings_resp.status = 500;
                  reuserAccountSettings_resp.data = 'Error occurred while fetching paymentkeys';
                  res.send(reuserAccountSettings_resp)
                }
                else {
                  reuserAccountSettings_resp.paymentKeys = result;
                  res.status = 200;
                  reuserAccountSettings_resp.status = 200;
                  res.send(reuserAccountSettings_resp);
                }
              });
            }
            else {
              res.status = 200;
              reuserAccountSettings_resp.status = 200;
              let storeGeneralInfo =
              {
                imageLogo: "",
                brandName: "",
                facebookUrl: "",
                instagramUrl: "",
                twitterUrl: "",
                phoneNumber: "",
                whatsApp: "",
                email: "",
                storePhysicalAddress: "",
                gstNo: "",
                panNo: "",
                cin: "",
                enableForCOD: true,
                enableForOnlinePayment: true,
                enableForEmailNotificationonOrder: true,
                enableForSMSNotificationonOrder: false,
                enableForSMSNotificationonDispatch: false,
                enableForShippingChargesCollect: true
              };
              let paymentKeys = {
                payUMerchantKey: "dummy",
                payUMerchantSalt: "dummy",
                payUMerchantHeader: "dummy",
              }
              reuserAccountSettings_resp.storeGeneralInfo = storeGeneralInfo;
              reuserAccountSettings_resp.paymentKeys = paymentKeys;
              res.send(reuserAccountSettings_resp);
            }
          }
        });
      }
    });
  } catch (error) {
    logger.error('Error occurred while fetching the account detaisl'.errror);
    reuserAccountSettings_resp.status = 500;
    reuserAccountSettings_resp.data = 'Error occurred while fetching the account details';
    res.send(reuserAccountSettings_resp)
  }
}

// //Get all customers for a seller
// exports.getCustomersBySellerID = function (req, res) {
//   let getCustomersBySellerID_resp = {};
//   try {

//     var url_data = url.parse(req.url, true);
//     var params = url_data.query;
//     let userId = params.userId;
//     let pageNo = params.page;
//     console.log('Req = ', userId);
//     let options = {
//       select: 'customers.fullName customers.phoneNo customers.added_date customers.email customers.shippingAddress',
//       sort: { added_date: -1 },
//       page: pageNo,
//       limit: 10
//     };
//     customerModel.paginate({ _id: userId }, options, function (err, result) {
//       if (err) {
//         getCustomersBySellerID_resp.status = 500;
//         getCustomersBySellerID_resp.data = 'Internal Error';
//         res.send(getCustomersBySellerID_resp)
//       }
//       else {
//         console.log('res', result)
//         if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
//           getCustomersBySellerID_resp.status = 200;
//           getCustomersBySellerID_resp.data = result["docs"][0].customers;
//           res.send(getCustomersBySellerID_resp)
//         }
//         else {
//           getCustomersBySellerID_resp.status = 204;
//           getCustomersBySellerID_resp.data = 'Sorry , you have No customers yet';
//           res.send(getCustomersBySellerID_resp)

//         }
//       }
//     });
//   } catch (error) {
//     console.log('Err', error)
//     getCustomersBySellerID_resp.status = 500;
//     getCustomersBySellerID_resp.data = 'Internal Server Error';
//     res.send(getCustomersBySellerID_resp);
//   }
// }

exports.getCustomersBySellerID = function (req, res) {
  try {
      let getOrderByUserId_resp = {};
      console.log('getPendingOrdersByUserId::', req.url);
      var url_data = url.parse(req.url, true);
      var params = url_data.query;
      let userId = params["userId"];
      let page = Number(params["page"]);
      let limit = 50;
      console.log(userId, page);
      let monthValue = Number(params["month"]);
      let yearValue = Number(params["year"]);
      console.log("monthValue", monthValue);
      console.log("yearValue", yearValue);
      let searchDate = moment('01/' + monthValue + '/' + yearValue, "DD/MM/YYYY");
      console.log("searchDate", searchDate);

      if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
          orderModel
          .find({ _id: userId })
          .select('customers.orders._id customers.orders.shippingDetails customers.orders.paymentDetails customers.orders.orderDetails customers.orders.added_date')
          .exec(function (err, result) {
              if (err) {
                  logger.error('Error in fetching order list', console.error);
                  getOrderByUserId_resp.status = 500;
                  getOrderByUserId_resp.data = 'Internal Server Error';
                  res.status(500);
                  res.send(getOrderByUserId_resp);
              }
              else {
                  // let sortedOrders = [];
                  
                  let orders = [];
                  if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                      getOrderByUserId_resp.status = 200;
                      let customerCount = 0;
                      result[0]['customers'].forEach(CustOrders => {
                          customerCount = customerCount  + 1;
                          CustOrders['orders'].forEach(order=>{
                              // if( order["paymentDetails"].paymendStatus =="COMPLETED" ){
                              if( order["paymentDetails"].paymendStatus == "COMPLETED" && searchDate.isSame(order.added_date, 'year') && searchDate.isSame(order.added_date, 'month') ){
                                  let cus = {};
                                  cus.order = order;
                                  cus.customerId = CustOrders.customerId;
                                  orders.push(cus);
                              }
                          });
                      });
                      sleep(2500).then(()=>{
                          let sortedOrders = _.sortBy(orders,"added_date").reverse();
                          if(sortedOrders.length <= limit && page == 1 ){
                              getOrderByUserId_resp.data = sortedOrders;
                              res.status(200);
                              res.send(getOrderByUserId_resp);
                          }
                          else if(sortedOrders.length >= limit && page == 1 ){
                              getOrderByUserId_resp.data = sortedOrders.slice(0,limit);
                              res.status(200);
                              res.send(getOrderByUserId_resp);
                          }
                          else{
                              getOrderByUserId_resp.data = sortedOrders.slice(limit*(page - 1), limit*(page -1) + limit);
                              res.status(200);
                              res.send(getOrderByUserId_resp);
                          }
                      });
                  }
                  else {
                      console.log('No Content');
                      getOrderByUserId_resp.status = 204;
                      getOrderByUserId_resp.data = 'No Content';
                      // res.status(204);
                      res.send(getOrderByUserId_resp);
                  }

              }
          });
          
      }
      else {
          getOrderByUserId_resp.status = 400;
          getOrderByUserId_resp.data = 'BAD Request !';
          res.status(400);
          res.send(getOrderByUserId_resp);
      }
  } catch (error) {
      logger.error('getProductsByUserId:: Error occurred', error);
      console.log('error', error);
      let getOrderByUserId_resp = {};
      getOrderByUserId_resp.status = 500;
      getOrderByUserId_resp.data = 'Internal Server error !';
      res.status(500);
      res.send(getOrderByUserId_resp);
  }

}

exports.getalldetails = function (req, res, next) {
  return res.status(200).json(decodedToken.firstName);
};

exports.getUsersByIds = function (req, res, next) {
  if (!req.body.userIds) {
    return next(new restify.InvalidArgumentError("Invalid user id"));
  }

  // map all with objectid

  var arryOfObjIds = _.map(req.body.userIds, function (i) {
    return new ObjectId(i);
  });

  User.find({
    _id: {
      $in: arryOfObjIds
    }
  })
    .select(" profile userName ")
    .exec(function (err, data) {
      if (err) {
        return next(new Restify.errors.InternalServerError(err));
      } else {
        res.status(200);
        res.send(data);
      }
    });
};

exports.getAllUsersExceptOneById = function (req, res, next) {
  if (!req.params.id) {
    return next(new restify.InvalidArgumentError("Invalid user id"));
  }
  User.find({
    _id: {
      $ne: req.params.id
    }
  })
    .select("_id userName profile")
    .lean()
    .exec(function (err, data) {
      res.status(200);
      res.send(data);
      next();
    });
};

// This function gets the details of Articles
exports.userallDetails = function (req, res, next) {
  var cursor = User;
  if (!cursor) {
    return next(
      new restify.errors.InternalServerError("Model instance(s) is not defined")
    );
  } else {
    cursor.find({}, function (err, objs) {
      if (err) {
        return next(new restify.errors.InternalServerError(err));
      } else {
        res.status(200);
        res.send(objs);
      }
    });
  }
};

exports.getUserRoles = (req, res, next) => {
  res.send(userRoles.userRoles);
};





