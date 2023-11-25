var rndString = require('randomstring');
var path = require('path');
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var handlerManager = require(path.join(__dirname, '..', 'service', 'fileHandlerManager'));

exports.genTestAttachPath = function(fileName, userId, resType, testId, callback) {
    var filePath = getTestAttchPath(userId, resType, testId);

    handlerManager.createDirectoryPath(filePath, false, function(err) {
        if (err) { 
            return callback(err);
        }

        var newFileName = getGeneratedFileName(fileName, 12);
        return callback(false, { filePath: filePath, newFileName: newFileName });
    });
}

var getTestAttchPath = function(userId, resType, testId) {
    if (config.Use_Cloud_Storage)
        return getClsResPath(userId, resType) + testId + '/';
    else
        return path.join(getClsResPath(userId, resType), testId);
}

exports.getTestAttchPath = getTestAttchPath;

exports.genClassResPath = function(fileName, userId, isTemp, resType, callback) {
    var filePath = getClsResPath(userId, resType, isTemp);

    handlerManager.createDirectoryPath(filePath, false, function(err) {
        if (err) {
            return callback(err);
        }

        var newFileName = getGeneratedFileName(fileName, 15);

        return callback(false, { filePath: filePath, newFileName: newFileName, originalFileName: fileName });
    });
};

var getClsResPath = function(userId, resType, isTemp) {
    if (isTemp) {
        if (config.Use_Cloud_Storage) {
            return config.Cloud_Storage_Path_Temp + 'classres/' + userId + '/' + resType + '/';
        } else
            return path.join(config.Storage_Path_Temp, 'classres', userId, resType);
    } else {
        if (config.Use_Cloud_Storage)
            return config.Cloud_Storage_Path + 'classres/' + userId + '/' + resType + '/';
        else
            return path.join(config.Storage_Path, 'classres', userId, resType);
    }
}

exports.getClsResPath = getClsResPath;

var getVideoResPath = function(userId, isPublic) {
    var resCat = isPublic ? 'public' : 'private';
    return userId + '/' + resCat + '/';
}

exports.getVideoResPath = getVideoResPath;

exports.getAssetPath = function(userId, fileName, callback) {
    var filePath = path.join(config.asset_storage, userId);

    var newFileName = getGeneratedFileName(fileName, 15);

    return callback(false, { filePath: filePath, newFileName: newFileName, originalFileName: fileName });
}

exports.getExistingAssetPath = function(userId, fileName) {
    var filePath = path.join(config.asset_storage, userId, fileName);
    return filePath;
}

exports.genMessageAttachPath = function(msgId, orderNo, callback) {
    var filePath = getMessagePath(msgId, orderNo);

    handlerManager.createDirectoryPath(filePath, false, function(err) {
        if (err) {
            return callback(err);
        }

        return callback(false, { filePath: filePath });
    });
};

var getMessagePath = function(msgId, orderNo) {
    if (config.Use_Cloud_Storage)
        return config.Cloud_Storage_Path + 'messages/' + msgId + '/' + orderNo + '/';
    else
        return path.join(config.Storage_Path, 'messages', msgId, orderNo);
}

exports.getMessagePath = getMessagePath;


exports.genProfilePicturePath = function(fileName, callback) {
    var filePath = getProfilePictureHomePath();
    handlerManager.createDirectoryPath(filePath, true, function(err) {
        if (err) {
            return callback(err);
        }
       // var dateSeed = getTimeMonthYearSeed();
        //var newFileName = dateSeed + getGeneratedFileName(fileName, 15);
        return callback(false,'gfgfgf');
    });
};

var getProfilePictureHomePath = function() {
    if (config.Use_Cloud_Storage)
        return config.Cloud_Storage_Path + '/profileimg/';
    else
        return path.join(config.Storage_Path, 'profileimg');
}

exports.getProfilePictureHomePath = getProfilePictureHomePath;

//Add date seed to reduce duplicate name possibility further
function getTimeMonthYearSeed() {
    var dt = new Date();
    var m = dt.getUTCMonth().toString();
    var y = dt.getUTCFullYear().toString();
    return m + y;
}

function getGeneratedFileName(originalName, charLength) {
    var generateStr = rndString.generate({ length: charLength, charset: 'alphanumeric' });
    var fileExt = originalName.split('.');
    return (generateStr + '.' + fileExt[fileExt.length - 1]);
}