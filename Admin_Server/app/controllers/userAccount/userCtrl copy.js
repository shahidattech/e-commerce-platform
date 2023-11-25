/* global __dirname */
var _ = require("lodash");
var logger = require('logger').createLogger();
var mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
var User = mongoose.model("User");
var fs = require("fs");
var path = require("path");
var Restify = require("restify");
var Joi = require("joi");
var async = require("async");
const { validationResult } = require('express-validator');
var check = require(path.join(__dirname,"..", "..", "service", "util", "checkValidObject"));
var encrypt = require(path.join( __dirname,"..", "..", "service","util","encryption"));



//Update User/Store Profiles

exports.updateProfile = function(req, res){
  try {
    let updateProfile_resp = {};
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            updateProfile_resp.status = 422;
            updateProfile_resp.data = 'Invalid Input';
            res.status(422);
            res.send(updateProfile_resp);
        }
        else{
          console.log('Req=', req.body);
          updateProfile_resp.status = 200;
          updateProfile_resp.data = 'Updated';
          res.status(200);
          res.send(updateProfile_resp);
        }
    
  } catch (error) {
    
  }
}

exports.updateUserPassword = function(req, res, next) {
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
      if (!user || !checkPassword(req.body.currentPassword, user)) {
        return next(
          new Restify.errors.InvalidArgumentError("Incorrect Password")
        );
      }
      User.findByIdAndUpdate(
        req.userId,
        {
          salt: randomSalt,
          hashedPwd: encrypt.hashPwd(randomSalt, req.body.passwd2)
        },
        {
          upsert: true
        }
      ).exec(function(err, document) {
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
