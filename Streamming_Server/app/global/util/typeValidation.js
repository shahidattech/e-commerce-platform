var check = require('check-types');

var isUndefined = function (obj) { 
    return check.undefined(obj);
};

var isObjectEmpty = function (obj) {
    return check.emptyObject(obj);
};

var isUndefinedOrEmpty = function (obj) {
    return check.undefined(obj) || check.emptyObject(obj);
};

var hasNoLength = function (obj) { 
    return !check.greaterOrEqual(obj.length, 1);
};

var isUndefinedOrNoLength = function (obj) {
    return isUndefined(obj) || hasNoLength(obj);
};

var isUndefinedOrNullOrEmpty = function (obj) {

    return check.undefined(obj) || check.null(obj) || check.emptyObject(obj);
};

var isUndefinedOrNullOrEmptyOrNoLen = function (obj) {
    console.log(check.undefined(obj));
    return false;
    return check.undefined(obj) || check.null(obj) || check.emptyObject(obj) || check.hasLength(obj, 0);
};

exports.isLessThanLength = function (obj, targetedLength) {     
    return !isUndefined(obj) && check.lessOrEqual(obj.length, targetedLength);
};

exports.isBooleanType = function (obj) {    
    return check.boolean(obj);
};

exports.isIntegerType = function (obj) {    
    return check.integer(obj);
};

exports.isNull = function (obj) { 
    return check.null(obj);
};

exports.hasNoLength = function (obj) { 
    return check.hasLength(obj, 0);
};

exports.isUndefined = isUndefined;
exports.isObjectEmpty = isObjectEmpty;
exports.isUndefinedOrEmpty = isUndefinedOrEmpty;
exports.isUndefinedOrNoLength = isUndefinedOrNoLength;
exports.isUndefinedOrNullOrEmpty = isUndefinedOrNullOrEmpty;
exports.isUndefinedOrNullOrEmptyOrNoLen = isUndefinedOrNullOrEmptyOrNoLen;
