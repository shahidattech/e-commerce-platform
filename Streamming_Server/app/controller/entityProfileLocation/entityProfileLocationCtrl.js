var restify = require('restify');
var venuesModels = require('mongoose').model('EntityLocationProfileModel');
var mongoose = require('mongoose');
var s3_ver = require('../../global/config/s3Config');
var aws = require('aws-sdk');
var url = require('url');
const Bluebird = require('bluebird');
aws.config.update({
    secretAccessKey: s3_ver.secretAccessKey,
    accessKeyId: s3_ver.accessKeyId,
    region: s3_ver.region
});
var s3 = new aws.S3();
exports.entityProfileLocationPhoto = function (req, res, next){
    var venueData = req.body;
    console.log(req.files);
    console.log(venueData);

    console.log('Uploading venueDatas Data with', req.body, '---------------------\n');
    if (!venuesModels)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
        venuesModels.findOneAndUpdate({ _id: mongoose.Types.ObjectId(venueData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(th);
            next();
        }
    });
};



exports.updatePhoto = function (req, res, next){
    var venueData = req.body;
    console.log(req.files);
    console.log(venueData);
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    console.log('set Purpose --->',set)

    if (!EntityLocationProfileModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    venuesModels.findOneAndUpdate({ _id: mongoose.Types.ObjectId(venueData._id) }, set, {upsert:true,multi: true}).exec(function(err, th) {
        // console.log(insertedArticle);
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
    venuesModels.findOne({_id: id}, function (err, venueData) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('entityProfileLocationPhoto', venueData)
            const { location_photos } = venueData.files[0];
            console.log('location_photos', location_photos)
            if (location_photos) {
                if (location_photos) {
                    location_photos.forEach(file => {
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
                    venuesModels.deleteOne({_id:id},(err,object)=>{
                        if(err){
                            res.send({status:'failure',response:err});
                        }else{
                            //res.send({status:'Success',response:object});
                            res.status(200);
                            res.send();
                        }
                    });
                   
                }).catch (err => console.log(err)) 

            } else {
                venuesModels.deleteOne({_id:id},(err,object)=>{
                    if(err){
                        res.send({status:'failure',response:err});
                    }else{
                        //res.send({status:'Success',response:object});
                        res.status(200);
                        res.send();
                    }
                });
            }
            
        }
    });
};