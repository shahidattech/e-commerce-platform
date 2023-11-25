/* global __dirname */
var path = require('path');
var jwt = require('jwt-simple');
var appConfig = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var redisDb = require(path.join(__dirname, '..', 'global', 'init', 'redis'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));

exports.authenticateUser = function(req, res, next) {
    //Get user token
    getUserToken(req, res, next);
    //Validate token
    validateToken(req, next);
};

var validateToken = function(req, next) {
    console.log("auth");
    //Get saved token from the Redis db and validate
    redisDb.redisClient.get(req.userId, function(err, token) {
        if (err) {
            return next(err);
        } else if (ck.isUndefinedOrNullOrEmptyOrNoLen(token)) {
            return next('Not found auth token');
        } else {
            var parsedJson = JSON.parse(token);

            if (parsedJson.token !== req.token)
                return next('Token does not match');

            req.userRole = parsedJson.userRole;
            next();
        }
    });
};

//Validate and recover token and user info in http header
function getUserToken(req, res, next) {
    //Validate incoming auth info
    if ((!ck.isUndefined(req.headers) &&
            !ck.isUndefined(req.headers.authorization))) {
        var token = req.headers.authorization.split(' ')[1];
        verifyToken(token);
    } else if (!ck.isUndefined(req.query.token)) {
        verifyToken(req.query.token);
    } else {
        return next('Missing auth headers');
    }

    function verifyToken(token) {
        var payload = decodeToken(token, appConfig.SECRECT_JWT_TOKEN_KEY, next);

        if (ck.isUndefined(payload) ||
            ck.isUndefined(payload.userId) ||
            ck.isUndefined(payload.secrectMix) ||
            payload.secrectMix != appConfig.JWT_TOKEN_MIX) {
            return next({ message: 'Unauthenticated', payload: payload });
        }

        req.token = token;
        req.userId = payload.userId;
    }
}

//Decode token to get the payload
var decodeToken = function(token, key, next) {
    try {
        return jwt.decode(token, key);
    } catch (error) {
        next(error);
    }
};