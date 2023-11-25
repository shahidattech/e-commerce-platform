var restify = require('restify');
var artistModel = require('mongoose').model('artistModel');
var mongoose = require('mongoose');
var Bluebird = require("bluebird");
var url = require('url');

exports.artistPhotos = function (req, res, next){
    var artistData = req.body;
    console.log('files',req.files.author_photos);
    console.log(artistData);
    var id = artistData._id;

    console.log('Uploading Artist Data with', req.body, '---------------------\n');
    if (!artistModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    artistModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(artistData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send({'result': 'File Uploaded'});
            next();
        }
    });

};


//
exports.updatePhoto = function (req, res, next){
    var artistData = req.body;
    console.log(req.files);
    console.log(artistData);
    var id = artistData._id;
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    console.log('set Purpose --->',set)

    if (!artistModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    artistModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(artistData._id) }, set, {upsert:true,multi: true}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send({'result': 'File Uploaded'});
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
    artistModel.findOne({_id: id}, function (err, artist) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('artist', artist)
            const { author_photos } = artist.files[0];
            if (author_photos) {

                if (author_photos) {
                author_photos.forEach(file => {
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
                artistModel.deleteOne({_id:id},(err,object)=>{
                    if(err){
                        res.send({status:'failure',response:err});
                    }else{
                        //res.send({status:'Success',response:object});
                        res.status(200);
                        res.send();
                    }
                });
               
            }).catch (err => console.log(err)) 

            }  else {
                console.log('deleteimage else')
                artistModel.deleteOne({_id:id},(err,object)=>{
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