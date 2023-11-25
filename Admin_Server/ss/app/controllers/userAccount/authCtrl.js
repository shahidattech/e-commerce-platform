/* global __dirname */
var path = require('path');
var restify = require('restify');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var https = require('https');

var User = mongoose.model('User');
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
var config = require(path.join(__dirname, '..', '..', 'global', 'config', 'appConfig'));


//Validate a user during login with the provided password and user id
exports.authenticate = function(req, res, next) {
    var userName = req.body.userName;
    var passwd = req.body.passwd;
    User.findOne({ 'userName': userName }).exec(function(err, user) {
        if (err) { //db error
            return next(new restify.errors.InternalServerError(err));
        }
        if (!user || null) { //User not found
            res.status(200);
            res.send({ success: false, active: false });
            return next();
        }
        if (!user.active) { //User found but not activated
            res.status(200);
            res.send({ success: true, active: false });
            return next();
        }
        var hasValidCred = false;
        //Check credentials 
        if (req.body.provider) {
            hasValidCred = checkSocialCredit(req.body, user);
        } else
            hasValidCred = checkPassword(passwd, user);
        if (user && hasValidCred) {
           
        jwt.createAndSendToken(user, function(err, userInfo, token,userRole) { 
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            }

            else{
              //  console.log(userRole);
            req.userRole = userInfo.userRole;
            req.userId = userInfo.userId;
            res.status(200);
            res.send({
                success: true,
                active: true,
                user: userInfo,
                token: token,
                userRole: userRole
                //features: availableFeatures,
               // pictureName: pictureName
            });

            next();
            }
        });
    } else {
        res.status(200);
        res.send({ success: false, active: false });
        next(); 
    }
    });
};

exports.getalldetails =  function(req,res,next){
   return res.status(200).json(decodedToken.userName);
  // let token = req.query.token;
  //console.log(token);
}

exports.logout = function(req, res, next) {
    jwt.removeToken(req, res, function() {
        res.status(200);
        res.send({ success: true});
        res.end();
    });
};

exports.verifyCaptcha = function(req, res, next) {
    var clientResponseKey = req.body.captchaResponse;
    if (!clientResponseKey) {
        next(false);
    } else {
        https.get(config.GOOGLE_CAPTCHA_VERIFY + "?secret=" + config.CAPTCHA_PRIVATE_KEY + "&response=" + clientResponseKey, function(res) {
            var data = "";
            res.on('data', function(chunk) {
                data += chunk.toString();
            });
            res.on('end', function() {
                try {
                    var parsedData = JSON.parse(data);

                    next(parsedData.success);
                } catch (e) {
                    next(false);
                }
            });
        });
    }
};

function checkPassword(incomingPassword, user) {
    return encrypt.hashPwd(user.salt, incomingPassword) === user.hashedPwd;
}

function checkSocialCredit(userInput, userDbInfo) {
    if (userInput.provider != userDbInfo.scProvider)
        return false;

    return encrypt.hashPwd(userDbInfo.salt, userInput.uid + '_' + userDbInfo.scKey) == userDbInfo.scHash;
}