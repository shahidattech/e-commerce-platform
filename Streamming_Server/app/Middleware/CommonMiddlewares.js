const multer = require('multer');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var path = require('path');

aws.config.update({
    // secretAccessKey: 'mJiGWGBrtAD2Pb+h6j3VsRbm39Nx2HfZRTJi/OFt',
    // accessKeyId: 'AKIAVTYKMDQ4XGTBWWOF',
    // region: 'us-east-1'
    secretAccessKey: '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',
    accessKeyId: 'AKIAIDT2ISJ5VDTAYF7Q',
    region: 'ap-south-1'
});


s3 = new aws.S3();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, __basedir + '/uploads/');
        // mybrand-image-uploads
        cb(null, __basedir + '/bucketname/article/artiCleID');
    },
});
var upload = multer({
    "storage": storage,
    fileFilter: function(req, file, cb) {
        var ext = path.extname(file.originalname);
        console.log('ext', ext);
        if (file.fieldname && (file.fieldname == "mainImage" || file.fieldname == "otherImages" || file.fieldname == "upload_files" || file.fieldname == "uploadFiles" || file.fieldname == "feature_image" || file.fieldname == "paragraph_img" || file.fieldname == "sliderImg")) {
            var validExtensions = ['.jpg', '.png', '.jpeg', ".gif", ".JPG", ".PNG", ".JPEG", ".GIF"];
            if (validExtensions.indexOf(ext) < 0) {
                return cb(new Error('Allowed image extentions are jpg,png,jpeg and gif'))
            }
        }
        if (file.fieldname && file.fieldname == "cv") {
            var validExtensions = [".pdf", ".doc", ".docx"];
            if (validExtensions.indexOf(ext) < 0) {
                return cb(new Error('Allowed CV extentions are pdf,doc and docx'))
            }
        }
        cb(null, true);
    }
});


var uploa = multer({
    storage: multerS3({
        s3: s3,
        //bucket: 'publiccontentsartinfo',
        // bucket: 'baimedia',
        bucket: 'mybrand-image-uploads',
        acl: 'bucket-owner-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        contentDisposition: 'attachment',
        serverSideEncryption: 'AES256',
        storageClass: 'REDUCED_REDUNDANCY',
        key: function(req, file, cb) {
            console.log('file.fieldname', file);
             var newFileName = `${file.fieldname}`+'_'+`${Date.now().toString()}`+'_'+`${file.originalname}`;
             var fullPath = `${file.fieldname}`+'/' + newFileName;
             cb(null, fullPath);
             console.log("fullPath upla",fullPath);
        }
    })
});
module.exports = upload;
module.exports = uploa;