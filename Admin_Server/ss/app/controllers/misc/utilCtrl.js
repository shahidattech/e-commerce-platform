var path = require('path');
var Restify = require('restify');
var exceptionHandler = require(path.join(__dirname, '..', '..', 'service', 'util', 'exceptionHandler'));


var callbackExceptionCatcher = function(err, req, res) {    
    if (err) {
        if (err.errType === 'uh') {
            exceptionHandler.internal(req, res, err);
        }
        else {
            exceptionHandler.invalidParam(res, err.error);
        }
    }
};

exports.callbackExceptionCatcher = callbackExceptionCatcher;

exports.checkAuthorization = function(req, res, next) {

    var isValidUser = req.userId == req.params.id;

    if (!isValidUser) {
        return next(new Restify.errors.UnauthorizedError('To complete the task'));
    }

    next();
};


var sendAuthFailedMsg = function(req) {
    return next(new Restify.errors.UnauthorizedError('To complete the task'));
};