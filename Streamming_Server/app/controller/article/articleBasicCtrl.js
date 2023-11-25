var restify = require('restify');
// var articleModel = require('mongoose').model('articleModel');
var productModel = require('mongoose').model('Product');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var s3_ver = require('../../global/config/s3Config');
var aws = require('aws-sdk');
var url = require('url');
var Bluebird = require("bluebird");
aws.config.update({
    secretAccessKey: s3_ver.secretAccessKey,
    accessKeyId: s3_ver.accessKeyId,
    region: s3_ver.region
});
var s3 = new aws.S3();

exports.updatearticle = function (req, res, next){
    var articleData = req.body;
    console.log("req.files", req.files);
    console.log("articleData", articleData);
    var id = articleData._id;

    console.log('Uploading Article Data with', req.body, '---------------------\n');
    if (!productModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    productModel.findOneAndUpdate({ _id: articleData._id},
        {$push:{ files:req.files}}, 
        {new: true, useFindAndModify: false}
        ).exec(function(err, th) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(th);
            next();
        }
    });
};

function deleteimageFromS3(params) {
    console.log('deleteimageFromS3', params)
    return new Bluebird((resolve, reject) => {
        s3.deleteObjects(params, function (err, data) {
            if (err) return reject(err); // an error occurred
            else return resolve(data); // successful response
        });
    });
}

exports.deleteimage = function (req, res, next){
    // var bucket = s3_ver.bucket_name;
    var bucket_name = 'baimedia';
    var url_data = url.parse(req.url, true);
    var id = url_data.query._id;
    articleModel.findOne({_id: id}, function (err, article) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('article', article)
            const { uploadFiles, paragraph_img, sliderImg } = article.files[0];
            if (uploadFiles) {
                uploadFiles.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }
            if (paragraph_img) {
                paragraph_img.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }
            if (sliderImg) {
                sliderImg.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }

            var options = {
                Bucket: bucket_name,
                Delete: {
                    Objects: objects
                }
            };          

            deleteimageFromS3(options)
              .then(data => {
                console.log('deleteimageFromS3 then', data)
                articleModel.deleteOne({_id:id},(err,object)=>{
                    if(err){
                        res.send({status:'failure',response:err});
                    }else{
                        //res.send({status:'Success',response:object});
                     res.status(200);
                            res.send();
                    }
                });
               
            }).catch (err => console.log(err)) 
        }
    });

    // try {
    //     s3.headObject(params).promise();
    //     console.log("File Found in S3");
    //     try {
    //         s3.deleteObject(params).promise();
    //         console.log("file deleted Successfully");
    //     }
    //     catch (err) {
    //         console.log("ERROR in file Deleting : " + JSON.stringify(err));
    //     }
    // } catch (err) {
    //         console.log("File not Found ERROR : " + err.code);
    // }
};

exports.updatePhoto = function (req, res, next){
    var articleData = req.body;
    console.log(req.files);
    console.log(articleData);
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    console.log('set Purpose --->',set)

    if (!articleModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    articleModel.findOneAndUpdate({ _id: articleData._id }, set, {upsert:false,multi: true}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(err);
        } else {
            res.status(200);
            res.send(th);
            next();
        }
    });
};
