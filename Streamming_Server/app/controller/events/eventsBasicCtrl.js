var restify = require('restify');
var eventsModel = require('mongoose').model('eventsModel');
var mongoose = require('mongoose');
var Bluebird = require("bluebird");
var url = require('url');

exports.eventPhotos = function (req, res, next){
    var eventData = req.body;
    console.log(req.files);
    console.log(eventData);
    var id = eventData._id;

    console.log('Uploading events Data with', req.body, '---------------------\n');
    if (!eventsModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    eventsModel.findOneAndUpdate({ _id: eventData._id }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(th);
        }
    });
};


exports.updatePhoto = function (req, res, next){
    var eventData = req.body;
    console.log(req.files);
    console.log(eventData);
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    console.log('set Purpose --->',set)

    if (!eventsModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    eventsModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(eventData._id) }, set, {upsert:true,multi: true}).exec(function(err, th) {
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
    eventsModel.findOne({_id: id}, function (err, event) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('event', event)
            const { main_events_photos, event_carousel_images } = event.files[0];
            if (main_events_photos) {
                main_events_photos.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }
            if (event_carousel_images) {
                event_carousel_images.forEach(file => {
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
                eventsModel.deleteOne({_id:id},(err,object)=>{
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
};