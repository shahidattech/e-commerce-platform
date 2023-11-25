/** Amazon aws S3 bucket private file upload controller */

/* global process */
/* global __dirname */
var path = require('path');
var aws = require('aws-sdk');
var cf = require('aws-cloudfront-sign');
var moment = require('moment');
var fs = require('fs');
var _ = require('lodash-node');
var fileHandler = require(path.join(__dirname, '..', 'service', 'localFileHandler'));
var fileHandlerMgr = require(path.join(__dirname, '..', 'service', 'fileHandlerManager'));
var logger = require(path.join(__dirname, '..', 'global', 'util', 'logger'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var pathGen = require(path.join(__dirname, '..', 'service', 'filePathGenerator'));
var db = require(path.join(__dirname, '..', 'global', 'config', 'mongo-db'));

/**
 AWS S3 sined url generation
*/

exports.s3SignedUrl = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.filename) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.filetype) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.filesize) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.isPublic)) {
        return next('Video upload parameter missing');
    }

    if (req.body.filesize > config.MAX_VIDEO_FILE_SIZE) {
        return next('File size is over the limit. Max allowed size - ' + config.MAX_VIDEO_FILE_SIZE / 1000000 + ' MB');
    }

    isUnderTotalAllowedLimit(req.body.filesize, req.userId, createUrl, next);

    function createUrl(isUnderLimit) {
        if (!isUnderLimit)
            return next('Total allowed storage limit has crossed. Max storage size - ' +
                Math.round(config.totalAllowedVideoStorageLimit / 1000000) + ' MB');

        var s3 = new aws.S3({
            signatureVersion: 'v4',
            region: config.s3Region,
            accessKeyId: config.s3AccessKeyId,
            secretAccessKey: config.s3SecretAccessKey
        });

        pathGen.genClassResPath(req.body.filename, req.userId, true, 'videos', function(err, data) {
            if (err) {
                return next(err);
            }
            var oldfile = data.originalFileName;
            var newfile = data.newFileName;
            var uploadType = req.body.isPublic ? 'public' : 'private';
            var uploadPath = req.userId + '/' + uploadType + '/' + data.newFileName;
            var fileType = req.body.filetype;

            var s3Params = {
                Bucket: config.s3_video_collect,
                Key: uploadPath,
                Expires: config.s3uploadexpires,
                ContentType: fileType,
                ACL: config.s3ACL
            };

            s3.getSignedUrl('putObject', s3Params, (err, data) => {
                if (err) {
                    return next(err);
                }

                var returnData = {
                    oldName: oldfile,
                    newName: newfile,
                    signedRequest: data,
                    url: `https://${config.s3_video_collect}.s3.amazonaws.com/${uploadPath}`
                };

                res.status(200);
                res.send(returnData);
                next();
            });
        });
    }
}

/**
 AWS cloudfront sined url generation for accsess a file
*/

exports.cfSignedUrl = function(req, res, next) {
    var fileName = req.body.filename;

    if (ck.isUndefinedOrNullOrEmptyOrNoLen(fileName)) {
        return next('Not found fileName');
    }

    var options = {
        keypairId: config.cloudFrontKeyId,
        privateKeyString: fs.readFileSync(path.join(__dirname, '..', 'global', 'config', 'cfkey',
            'pk-' + config.cloudFrontKeyId + '.pem'), 'utf-8'),
        expireTime: moment().add(1, 'day')
    };

    var signedUrl = cf.getSignedUrl('https://' + config.cloudFrontDomain + '/' + fileName, options);

    res.status(200);
    res.send(signedUrl);
    next();
}

function isUnderTotalAllowedLimit(requestedFileSize, userId, callback, next) {
    var resourceModel = db.getDb().collection('resources');

    resourceModel.aggregate([
        { $match: { 'teacherId': userId } },
        { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
    ], function(err, data) {
        if (err) {
            return next(err);
        }
        if (ck.isUndefinedOrNullOrEmpty(data) || data.length == 0) {
            return callback(true);
        }

        var isUnderLimit = config.totalAllowedVideoStorageLimit > (data[0].totalSize + requestedFileSize);

        callback(isUnderLimit);
    });
}