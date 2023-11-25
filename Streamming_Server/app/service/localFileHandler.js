/* global __dirname */
var fs = require('fs');
var mkpath = require('mkpath');
var shortid = require('shortid');
var async = require("async");
var path = require('path');
var appConfig = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var sm = require(path.join(__dirname, '..', 'global', 'init', 'storageManager'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
//var im = require('imagemagick-stream');

exports.saveFileToLocalStorage = function(req, res, next) {
    if (!req.fileName || !req.filePath)
        return next('Invalid file info');

    var readStream = fs.createReadStream(req.file.path);
    var writeStream = fs.createWriteStream(path.join(req.filePath, req.fileName));
    //var resize = im().resize('400x400').quality(90);
    //readStream.pipe(resize).pipe(writeStream);    

    readStream.on('error', errorCallback);
    writeStream.on('error', errorCallback);

    function errorCallback(err) {
        return next(err);
    };

    writeStream.on('finish', function() {
        readStream.close();
        writeStream.end();
        return res.send({ newFileName: req.fileName });
    });
};

exports.uploadFile = function(req, res, storagePath, fileName, file, userId, isForcedRename) {

    if (file.size >= appConfig.MAX_FILE_SIZE) {
        errh.invalidParam(res, 'File size is over the limit', { storagePath: storagePath, userId: userId, method: 'uploadFile' });
        return;
    }

    if (isForcedRename) {
        var newFileName = getModifiedFileName(fileName);
        saveFileToDisk(req, res, storagePath, newFileName, file, userId);
    } else {
        fs.exists(path.join(storagePath, fileName), function(exists) {
            var newFileName = fileName;
            if (exists) {
                newFileName = getModifiedFileName(fileName);
            }

            saveFileToDisk(req, res, storagePath, newFileName, file, userId);
        });
    }
};

var getModifiedFileName = function(originalName) {
    var generateStr = shortid.generate();
    var fileExt = originalName.split('.');
    return (generateStr + '.' + fileExt[fileExt.length - 1]);
};

var saveFileToDisk = function(req, res, storagePath, fileName, file, userId) {

    try {

        if (!fileName)
            throw new Error('Invalid file name');
        var writeStream = {};
        var readStream = fs.createReadStream(file.path);

        writeStream = fs.createWriteStream(path.join(storagePath, fileName));
        readStream.pipe(writeStream);

        var errorCallback = function() {
            errh.internal(req, res, 'Exception in read write stream on upload', { storagePath: storagePath, userId: userId, fileName: fileName, method: 'uploadFile' });
            return;
        };

        readStream.on('error', errorCallback);
        writeStream.on('error', errorCallback);

        writeStream.on('finish', function() {
            readStream.close();
            writeStream.end();
            return res.send({ newFileName: fileName });
        });

    } catch (error) {
        errh.internal(req, res, 'Exception in read write stream on upload', { storagePath: storagePath, userId: userId, fileName: fileName, method: 'uploadFile' });
        return;
    }
};

exports.renameFile = function(req, res, filePath, fileName) {
    try {
        var generateStr = shortid.generate();
        var newFileName = '';
        var existingFilePath = '';

        newFileName = 'deleted_' + generateStr + '_' + fileName;
        existingFilePath = path.join(filePath, fileName);

        var newFilePath = path.join(filePath, newFileName);

        fs.rename(existingFilePath, newFilePath, function(err) {
            if (err) {

                errh.internal(req, res, 'Exception in renaming file', { filePath: filePath, fileName: fileName, method: 'renameFile' });
                return;
            }
            return res.send(true);
        });
    } catch (error) {
        errh.invalidParam(res, 'Exception while renaming file.', { filePath: filePath, fileName: fileName, method: 'renameFile', error: error });
        return;
    }
};

exports.createDirectoryPath = function(filePath, callback) {
    mkpath(filePath, function(err) {
        if (err) {
            if (err.errno === 4075 && err.code === 'EEXIST')
                callback();
            else {
                callback(err);
            }
        } else {        
            callback();
        }
    });
};

exports.removeFile = function(req, res, next) {
    fs.unlink(req.filePath, function(err) {
        if (err) {
            return next(err);
        }

        res.status(200);
        res.send(true);
        next();
    });
};

exports.streamLocalStorageFile = function(req, res, next) {
    var file = {};
    try {
        file = path.resolve(req.filePath);
    } catch (error) {
        return next('Error in stream file path resolve');
    }
    var stream = fs.createReadStream(file)
        .on("open", function() {
            stream.pipe(res);
        }).on("error", function(err) {
            return next(err);
        });
};


exports.streamAudioVideoLocalStorageFile = function(req, res, next) {
    //Get requested file stat
    fs.stat(req.filePath, function(err, stats) {
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
            var stream = fs.createReadStream(req.filePath, { start: start, end: end })
                .on("open", function() {
                    stream.pipe(res);
                }).on("error", function(err) {
                    return next('Cannot stream file.');
                });
        } catch (error) {
            return next(error);
        }

    });
};