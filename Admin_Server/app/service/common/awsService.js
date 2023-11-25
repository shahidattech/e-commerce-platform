let path = require('path');
var check = require(path.join(__dirname, '..', 'util', 'checkValidObject'));
const fs = require('fs-extra');
const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: 'AKIAVTYKMDQ4XGTBWWOF',
    secretAccessKey: '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',
    region: 'us-east-1'
});


exports.uploadFileToS3 = function(data, callback) {
    try {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(data)) {
            // console.log('data.FILEPATH', data.FILEPATH);
            fs.readFile(data.FILEPATH, function(err, fileContent){
                if(err){
                    console.log('Err in reading file', err);
                }
                else{
                    // console.log('data.FILEPATH', fileContent);
                    const params = {
                        Bucket: data.BUCKET,
                        Key: data.KEY,
                        Body: fileContent,
                        ACL: 'public-read'
                    };
                    // console.log('params = ', params);
                    const s3 = new AWS.S3();
                    s3.upload(params, function (s3Err, data) {
                        // console.log('AWS Response=', data);
                        if (s3Err) {
                            console.log('Error in uploading File', s3Err);
                        }
                        else{
                            callback(data);
                        }
                    });
                }

            })

        }
    } catch (error) {
        console.log('Error in uploadFileToS3: ', error);
    }
}
