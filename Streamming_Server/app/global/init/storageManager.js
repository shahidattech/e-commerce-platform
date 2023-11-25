var path = require('path');
var config = require(path.join(__dirname, '..', 'config', 'appConfig'));

var internalStorageClient = {};
var publicStorageClient = {};

var videoCollectStorageClient = {};
var videoStreamStorageClient = {};
var assetStorageClient = {};

exports.initStorage = function(config) {

    if (config.Use_Cloud_Storage) {
        var S3FS = require('s3fs');
        var options = {
            apiVersion: config.apiVersion,
            accessKeyId: config.s3AccessKeyId,
            secretAccessKey: config.s3SecretAccessKey,
            region: config.s3Region
        };

        internalStorageClient = new S3FS(config.private_storage, options);
        publicStorageClient = new S3FS(config.public_storage, options);
        assetStorageClient = new S3FS(config.asset_storage, options);

        videoCollectStorageClient = new S3FS(config.s3_video_collect, options);
        videoStreamStorageClient = new S3FS(config.s3_video_stream, options);
    } else {
        internalStorageClient = require('fs');
    }
};

//Expose storage client 
exports.getStClient = function() {
    return internalStorageClient;
}

exports.getStPublicClient = function() {
    return publicStorageClient;
}

exports.getVideoCollectClient = function() {
    return videoCollectStorageClient;
}

exports.getVideoStreamClient = function() {
    return videoStreamStorageClient;
}

exports.assetStorageClient = function() {
    return assetStorageClient;
}