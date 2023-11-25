var fs = require('fs');
var through = require('through2');
var path = require('path');
var mime = require('mime');
var sm = require(path.join(__dirname, '..', 'global', 'init', 'storageManager'));
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var im = require('imagemagick-stream');
var s3_ver = require('../global/config/s3Config');
var aws = require('aws-sdk');
var bucket_name = 'baimedia';
aws.config.update({
secretAccessKey: 'TOA3bMsAJKH/ciijynSgWbOcX2jukbHNZq/NN+Df',
accessKeyId: 'AKIAVSYFW7UGKZVSLMG6',
region: 'us-east-1'
});
// aws.config.update({
//     secretAccessKey: s3_ver.secretAccessKey,
//     accessKeyId: s3_ver.accessKeyId,
//     region: s3_ver.region
// });
var s3 = new aws.S3();
exports.streamCloudStorageFile = function(req, res, next) {
    //console.log(req.fileName, 'filename');
    var params = {
        Bucket: bucket_name,
        Key: req.fileName
    };
    console.log(req.fileName);
    //var stream = s3.getObject(params).createReadStream(req.filePath);
    //stream.pipe(res);    
    
    s3.getObject(params)
    .createReadStream(req.filePath)
    .on('error', (e) => {
        console.log('createReadStream error', e)
        res.status(200)
        res.send();
    // handle aws s3 error from createReadStream
    })
    .pipe(res);

   
    // var file = require('fs').createWriteStream('D:/bai/bai/mediaServer/uploads/file.jpg');
   
    //console.log(stream);
    // var filename = !req.fileDisplayName ? path.basename(req.filePath) : path.basename(req.fileDisplayName);
    // var mimetype = mime.lookup(req.filePath);
    // var disposition = req.query.download == true ? 'attachment' : 'inline';

    // res.setHeader('Content-disposition', disposition + '; filename=' + filename);
    // res.setHeader('Content-type', mimetype);

    // var stream = getBucket(req.isPublic).createReadStream(req.filePath);
    // stream.pipe(res);
}

exports.createDirectoryPath = function(filePath, isPublic, callback) {
    getBucket(isPublic).mkdirp(filePath).then(function() {
        callback();
    }, function(reason) {
        callback(reason);
    });
};

exports.saveImageToCloudStorage = function(req, res, next) {
    if (!req.fileName || !req.filePath)
        return next('Invalid file info');

    var readStream = fs.createReadStream(req.file.path);
    var fullFilePath = req.filePath + '/' + req.fileName;
    var writeStream = getBucket(req.isPublicStorage).createWriteStream(fullFilePath);

    if (req.body.shouldResize && req.body.shouldResize == 'no') {
        readStream.pipe(writeStream);
    } else {
        var resize = im().resize('200x200').quality(90);
        readStream.pipe(resize).pipe(writeStream);
    }

    writeStream.on('finish', function() {
        readStream.close();
        res.status(200);
        return res.send({ newFileName: req.fileName });
    });

};

exports.saveFileToCloudStorage = function(req, res, next) {
    if (!req.fileName || !req.filePath)
        return next('Invalid file info');

    var readStream = fs.createReadStream(req.file.path);
    var fullFilePath = req.filePath + '/' + req.fileName;

    getBucket(req.isPublicStorage)
        .writeFile(fullFilePath, readStream, function(err) {
            if (err) {
                return next(err);
            }

            readStream.close();
            res.status(200);
            return res.send({ newFileName: req.fileName });
        });

};

exports.saveAssetFileCloudStorage = function(req, res, next) {
    if (!req.fileName || !req.filePath)
        return next('Invalid file info');

    var readStream = fs.createReadStream(req.file.path);
    var fullFilePath = req.filePath + '/' + req.fileName;

    sm.assetStorageClient()
        .writeFile(fullFilePath, readStream, function(err) {
            if (err) {
                return next(err);
            }

            readStream.close();
            res.status(200);
            return res.send({ newFileName: req.fileName });
        });
};

exports.removeCloudStorageAssetFile = function(req, res, next) {
    sm.assetStorageClient().unlink(req.filePath, function(err) {
        if (err) {
            return next(err);
        }

        res.status(200);
        res.send(true);
        next();
    });
}

exports.removeCloudStorageFile = function(req, res, next) {
    getBucket(req.isPublic).unlink(req.filePath, function(err) {
        if (err) {
            return next(err);
        }

        res.status(200);
        res.send(true);
        next();
    });
};

exports.removeCloudStorageVideoFile = function(req, res, next) {
    var bucketName = {};

    if (!req.body.reviewed) {
        bucketName = sm.getVideoCollectClient();
    } else
        bucketName = sm.getVideoStreamClient();

    bucketName.unlink(req.filePath, function(err) {
        if (err) {
            return next(err);
        }

        res.status(200);
        res.send(true);
        next();
    });
}


exports.streamAudioVideoCloudStorageFile = function(req, res, next) {

    //Get requested file stat
    getBucket(req.isPublic).stat(req.filePath, function(err, stats) {
        if (err || ck.isUndefinedOrNullOrEmptyOrNoLen(stats)) {
            return next('File not found');
        }

        try {

            var filename = path.basename(req.filePath);

            var stream = getBucket(req.isPublic).createReadStream(req.filePath);

            var wstream = fs.createWriteStream(filename);

            stream.pipe(wstream);

            //console.log(wstream);

            wstream.on('finish', function() {
                console.log('ending');
                wstream.close();
                sendStream();
            })

            function sendStream() {
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
                var rsstream = fs.createReadStream(filename, { start: start, end: end })
                    .on("open", function() {
                        rsstream.pipe(res);
                    }).on("error", function(err) {
                        return next('Cannot stream file.');
                    });

                //rstream.pipe(res);

            }

            // stream.on('readable', function () { console.log('readable!'); })
            //     //.on('data', function (data) { console.log('Data!', data); })
            //     .on('error', function (err) { console.error('Error', err);/* READ if there was an error receiving data. */ })
            //     .on('end', function () { stream.pipe(res);  /* READ fires when no more data will be provided. */ })
            //     .on('finish', function () { console.log('All Finished!');  /*WRITEABLE */ })
            //     .on('close', function () { console.log('close!'); /*WRITEABLE not all streams emit this*/ })


            //stream.pipe(res);

            //console.log('stream', stream);

            // var stream = getBucket(req.isPublic)
            // .createReadStream(req.filePath, { start: start, end: end })
            // .on("data", function(data) {
            //     // while ((chunk=stream.read()) != null) {
            //     //     stream.pipe(res);
            //     // }
            //     //stream.push(data).pipe(res);                    

            // }).on("error", function(err) {
            //   res.end(err);
            // });

            //stream.pipe(res);

            // stream.on('readable', function () { console.log('readable!'); })
            //     .on('data', function (data) { console.log('Data!', data); })
            //     .on('error', function (err) { console.error('Error', err);/* READ if there was an error receiving data. */ })
            //     .on('end', function () { console.log('All done!');   /* READ fires when no more data will be provided. */ })
            //     .on('finish', function () { console.log('All Finished!');  /*WRITEABLE */ })
            //     .on('close', function () { console.log('close!'); /*WRITEABLE not all streams emit this*/ })

        } catch (error) {
            return next(error);
        }
    });
}


function getBucket(isPublic) {
    return isPublic == true ? sm.getStPublicClient() : sm.getStClient();
}