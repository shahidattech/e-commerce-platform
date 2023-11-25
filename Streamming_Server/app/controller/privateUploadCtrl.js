/** Amazon aws S3 bucket private file upload controller */ 
/* global process */
/* global __dirname */
var path = require('path');
var aws = require('aws-sdk');
var cf = require('aws-cloudfront-sign');
var fileHandler = require(path.join(__dirname, '..', 'service', 'localFileHandler'));
var fileHandlerMgr = require(path.join(__dirname, '..', 'service', 'fileHandlerManager'));
var logger = require(path.join(__dirname, '..', 'global', 'util', 'logger'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var pathGen = require(path.join(__dirname, '..', 'service', 'filePathGenerator'));
var s3bucket = config.private_storage;
s3bucket = 'cstestvideoupload';


/**
 AWS S3 sined url generation
*/

exports.s3SignedUrl = function (req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query['filename'])) {
        return next('fileName is require');
    }
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query['filetype'])) {
        return next('filetype is require');
    }
    if (!ck.isUndefinedOrNullOrEmptyOrNoLen(req.query['filesize']) && req.query['filesize'] > config.MAX_VIDEO_FILE_SIZE) {
        return next('File size is over the limit');
    }
    const s3 = new aws.S3({
        signatureVersion: 'v4',
        region: config.s3Region
    });
    pathGen.genClassResPath(req.query['filename'], req.userId, true, 'videos', function (err, data) {
        if (err) {
            return next(err);
        }
        const fileName = 'videos/' + req.userId + '/' + data.newFileName;
        const fileType = req.query['filetype'];
        const s3Params = {
            Bucket: s3bucket,
            Key: fileName,
            Expires: config.s3expires,
            ContentType: fileType,
            ACL: config.s3ACL
        };

        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
                return next(err);
            }
            const returnData = {
                signedRequest: data,
                url: `https://${s3bucket}.s3.amazonaws.com/${fileName}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    });

}

/**
 AWS cloudfront sined url generation for accsess a file
*/

exports.cfSignedUrl = function (req, res, next) {
    console.log(req.body.filename);
    var fileName = req.query['filename'];
    var type = 'https';
    if (req.query['tp'] == 'rtmp') {
        type = 'rtmp';
    }

    if (ck.isUndefinedOrNullOrEmptyOrNoLen(fileName)) {
        return next('Not found fileName');
    }
    // to change cloudfront keys change accessKeyId in appConfig file and paste your .rem file to cfkey directory
    var options = {
        keypairId: config.cloudFront.accessKeyId,
        privateKeyPath: path.join(__dirname, '..', 'global', 'config', 'cfkey', 'pk-' + config.cloudFront.accessKeyId + '.pem'),
        expireTime: (new Date().getTime() + config.cloudFront.expireTime)
    }


    if (type == 'rtmp') {
        var signedRTMPUrlObj = cf.getSignedRTMPUrl('s2tc89eyuym0sd.cloudfront.net', fileName, options);
        //    console.log('RTMP Server Path: ' + signedRTMPUrlObj.rtmpServerPath);
        //    console.log('Signed Stream Name: ' + signedRTMPUrlObj.rtmpStreamName);
        res.send(signedRTMPUrlObj.rtmpServerPath + '/' + signedRTMPUrlObj.rtmpStreamName );
    } else {
        var signedUrl = cf.getSignedUrl('https://d1rdp68psvniy1.cloudfront.net/' + fileName, options);

        res.send(signedUrl);
    }
}
