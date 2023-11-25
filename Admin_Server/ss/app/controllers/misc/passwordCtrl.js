var _ = require('lodash');
var fs = require('fs');
var jwt = require('jwt-simple');
var path = require('path');
var User = require('mongoose').model('User');
var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
var envConfig = require(path.join(__dirname, '..', '..', 'global', 'config', 'appConfig'));


exports.reset = function(req, res, next) {
    var token = req.body.token;
    var payload = jwt.decode(token, envConfig.EMAIL_SECRET);
    var email = payload.sub;
    var randomSalt = encrypt.createSalt();

    if (!email) return handleError(res);

    User.findOne({ userName: email }).exec(function(err, foundUser) {
        if (err) return res.status(500);
        if (!foundUser) {
            return handleError(res);
        }

        if (!foundUser.active)
            foundUser.active = true;
        User.findByIdAndUpdate(foundUser._id, {
                salt: randomSalt,
                hashedPwd: encrypt.hashPwd(randomSalt, req.body.passwdnew)
            }, {
                upsert: true,
            })
            .exec(function(err, document) {
                if (err) {
                    return next(new Restify.errors.InternalServerError(err));
                } else {
                    res.status(200);
                    res.send(true);
                    next();
                }
            });
    });
};