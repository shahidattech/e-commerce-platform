/* global process */
/* global __dirname */
var path = require('path');
var logger = require(path.join(__dirname, '..', 'global', 'util', 'logger'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var sm = require(path.join(__dirname, '..', 'global', 'init', 'storageManager'));
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var pathGen = require(path.join(__dirname, '..', 'service', 'filePathGenerator'));
var fileHandlerMgr = require(path.join(__dirname, '..', 'service', 'fileHandlerManager'));

//Class video
exports.onDemandClassVideoStream = function (req, res, next) {
    
    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required parameter is missing.')
    }
    
    //Resolve file path        
    var userId = req.userRole == 'teacher' ? req.userId : req.teacherId;
    
    var fileHomePath = pathGen.getClsResPath(userId.toString(), 'videos');

    req.filePath = fileHomePath;
    req.fileName = req.query.filename;
    req.isPublic = false;
            
    fileHandlerMgr.audioVideostreamFile(req, res, next);
    
    //onDemandVideoAudioStream(req, res, filePath, next);
};

//Test attachments audio
exports.onDemandTestAudioStream = function (req, res, next) {

    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.query) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.testId) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.query.filename)) {
        return next('Required parameter is missing');
    }        
    
    //Resolve file path        
    var userId = req.userRole == 'teacher' ? req.userId : req.teacherId;

    var fileHomePath = pathGen.getTestAttchPath(userId, 'tests', req.query.testId);

    req.filePath = fileHomePath;
    req.fileName = req.query.filename;
    req.isPublic = false;
    
    fileHandlerMgr.audioVideostreamFile(req, res, next);
};

var onDemandVideoAudioStream = function (req, res, filePath, next) {
    //Get requested file stat
    sm.getStClient().stat(filePath, function (err, stats) {
        if (err || ck.isUndefinedOrNullOrEmptyOrNoLen(stats)) {
            return next('File not found');
        }

        try {
            //Check if the video/audio file request is with range 
            var range = req.headers.range;
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10); //Starting position of the stream
            
            //Get total file size and determine the size of stream chunks
            var total = stats.size;
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;
            
            //Create stream response header with requested spec
            res.writeHead(206, {
                "Content-Range": "bytes " + start + "-" + end + "/" + total,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4;audio/mp3"
            });

            //Pipe file stream to the caller
            var stream = sm.getStClient().createReadStream(filePath, { start: start, end: end })
                .on("open", function () {
                    stream.pipe(res);
                }).on("error", function (err) {
                    return next('Cannot stream file.');
                });
        }
        catch (error) {
            return next(error);
        }

    });
};
