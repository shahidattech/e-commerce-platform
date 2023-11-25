/* global process */
/* global __dirname */
var path = require('path');
var logger = require(path.join(__dirname, '..', 'global', 'util', 'logger'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var sm = require(path.join(__dirname, '..', 'global', 'init', 'storageManager'));
var fileHandler = require(path.join(__dirname, '..', 'service', 'localFileHandler'));
var fs = require('fs');
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var pathGen = require(path.join(__dirname, '..', 'service', 'filePathGenerator'));
var fileHandlerMgr = require(path.join(__dirname, '..', 'service', 'fileHandlerManager'));
var url = require('url');  
var querystring = require('querystring');

exports.downloadFile = function(req, res, next) {
    var parsedUrl = url.parse(req.url);  
    req.query = querystring.parse(parsedUrl.query);
    console.log("query data", req.query);
    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename) || ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filePath)
         ) {
        return next('Required paramter missing.');
    }
    
    var fileOwner = req.query.fileOwner;
   // res.send(parsedUrl);
    if (fileOwner){
        var userId = req.userId;
      //  console.log(fileOwner, false);
        var fileHomePath = pathGen.getResPath(fileOwner, false);
        req.filePath = fileHomePath;
        req.isPublic = false;
        if (req.query.filedisplayname)
            req.fileDisplayName = req.query.filedisplayname;
    }
    else{
        req.filePath = req.query.filePath;
        req.fileName = req.query.filename;
       // console.log(req.filePath,req.fileName);
    }
    fileHandlerMgr.streamFile(req, res, next);
};

exports.getTestAttachedFile = function(req, res, next) {

    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.testId) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required parameter missing');
    }


    //Resolve file path        
    var userId = req.userRole == 'teacher' ? req.userId : req.teacherId;
    var fileHomePath = pathGen.getTestAttchPath(userId, 'tests', req.query.testId);

    req.filePath = fileHomePath;
    req.fileName = req.query.filename;
    req.isPublic = false;
    if (req.query.filedisplayname)
        req.fileDisplayName = req.query.filedisplayname;

    fileHandlerMgr.streamFile(req, res, next);
};

exports.getClassNoteFile = function(req, res, next) {
    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required paramter missing.');
    }

    //Resolve file path        
    var userId = req.userRole == 'teacher' ? req.userId : req.teacherId;
    var fileHomePath = pathGen.getClsResPath(userId, 'notes', false);

    req.filePath = fileHomePath;
    req.fileName = req.query.filename;
    req.isPublic = false;
    if (req.query.filedisplayname)
        req.fileDisplayName = req.query.filedisplayname;

    fileHandlerMgr.streamFile(req, res, next);
};

exports.getMsgAttachFile = function(req, res, next) {
    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.msgId) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.orderNo) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required prameter missing.');
    }

    var fileHomePath = pathGen.getMessagePath(req.query.msgId, req.query.orderNo);
    req.filePath = fileHomePath;
    req.fileName = req.query.filename;
    req.isPublic = false;
    fileHandlerMgr.streamFile(req, res, next);
};

exports.removeClassResource = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.resourceType) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.fileName) ||
        (req.body.resourceType != 'notes' && req.body.resourceType != 'videos')) {
        return next('Required prameter missing.');
    }

    if (req.body.resourceType == 'videos') {
        //Resolve file path
        var fileHomePath = pathGen.getVideoResPath(req.userId, req.body.isPublic);

        req.filePath = fileHomePath + req.body.fileName;

        fileHandlerMgr.removeVideoFile(req, res, next);
    } else {

        //Resolve file path
        var fileHomePath = pathGen.getClsResPath(req.userId, req.body.resourceType, false);

        req.filePath = fileHomePath;
        req.fileName = req.body.fileName;
        req.isPublic = false;
        fileHandlerMgr.removeFile(req, res, next);
    }
};

exports.removeAsset = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.fileName)) {
        return next('Required prameter missing.');
    }

    //Resolve file path
    var fileHomePath = pathGen.getExistingAssetPath(req.userId, req.body.fileName);

    req.filePath = fileHomePath;

    fileHandlerMgr.removeAssetFile(req, res, next);
};

exports.removeProfilePicture = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.fileName)) {
        return next('Required parameter is missing');
    }

    var fileHomePath = pathGen.getProfilePictureHomePath();
    req.filePath = fileHomePath;
    req.fileName = req.body.fileName;
    req.isPublic = true;
    fileHandlerMgr.removeFile(req, res, next);
}

exports.getProfilePicture = function(req, res, next) {
    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required parameter is missing');
    }

    req.filePath = path.join(config.Storage_Path, 'profileimg', req.query.filename);

    fileHandler.streamLocalStorageFile(req, res, next);
};

exports.removeAttachedFile = function(req, res, next) {
    if (req.userRole != 'teacher') {
        return next('Unauthorized resource access');
    }

    var fileHomePath = pathGen.getTestAttchPath(req.userId, 'tests', req.query.testId);

    req.filePath = fileHomePath;
    req.fileName = req.query.fileName;
    req.isPublic = false;

    fileHandlerMgr.removeFile(req, res, next);
}

// exports.getClassPicture = function (req, res, next) {
//     if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
//         ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.fileName)) {
//         return next('Required parameter is missing.');
//     }

//     var filePath = path.join(config.Storage_Path, 'classres', 'picture', req.query.fileName);

//     streamFile(res, filePath, '', next);
// };