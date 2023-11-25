var path = require('path');
var localStorage = require(path.join(__dirname, 'localFileHandler'));
var cloudStorage = require(path.join(__dirname, 'cloudFileHandler'));
var appConfig = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
exports.createDirectoryPath = function(filePath, isPublic, callback) {
    if (appConfig.Use_Cloud_Storage) {
        cloudStorage.createDirectoryPath(filePath, isPublic, callback);
    } else {
        localStorage.createDirectoryPath(filePath, callback);
    }
};

exports.uploadFile = function(req, res, next) {
    if (appConfig.Use_Cloud_Storage) {
        cloudStorage.saveFileToCloudStorage(req, res, next);
    } else {
        localStorage.saveFileToLocalStorage(req, res, next);
    }
};

exports.uploadAssetFile = function(req, res, next) {
    cloudStorage.saveAssetFileCloudStorage(req, res, next);
};

exports.uploadProfilePic = function(req, res, next) {
    if (appConfig.Use_Cloud_Storage) {
        cloudStorage.saveImageToCloudStorage(req, res, next);
    } else {
        localStorage.saveFileToLocalStorage(req, res, next);
    }
};

exports.removeFile = function(req, res, next) {
    if (appConfig.Use_Cloud_Storage) {
        req.filePath = req.filePath + req.fileName;
        cloudStorage.removeCloudStorageFile(req, res, next);
    } else {
        req.filePath = path.join(req.filePath, req.fileName);
        localStorage.removeFile(req, res, next);
    }
};

exports.removeVideoFile = function(req, res, next) {
    cloudStorage.removeCloudStorageVideoFile(req, res, next);
}

exports.removeAssetFile = function(req, res, next) {
    cloudStorage.removeCloudStorageAssetFile(req, res, next);
}

exports.streamFile = function(req, res, next) {
    if (appConfig.Use_Cloud_Storage == true) {
        req.filePath = req.filePath + req.fileName;
        req.fileName = req.fileName;
        if(ck.isNull(req.fileName) ||
        ck.isNull(req.filePath)) {
            console.log('hi');
        }else{
              cloudStorage.streamCloudStorageFile(req, res, next);   
        }
        
    } else {
        req.filePath = path.join(req.filePath, req.fileName);
        localStorage.streamLocalStorageFile(req, res, next);
    }
};

exports.audioVideostreamFile = function(req, res, next) {
    if (appConfig.Use_Cloud_Storage) {
        req.filePath = req.filePath + req.fileName;
        cloudStorage.streamAudioVideoCloudStorageFile(req, res, next);
    } else {
        req.filePath = path.join(req.filePath, req.fileName);
        localStorage.streamAudioVideoLocalStorageFile(req, res, next);
    }
};