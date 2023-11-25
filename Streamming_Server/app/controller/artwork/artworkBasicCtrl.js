var restify = require('restify');
var artworkModel = require('mongoose').model('artworkModel');
var mongoose = require('mongoose');
var Bluebird = require("bluebird");
var url = require('url');

exports.artworkPhotos = function (req, res, next){
    var artwork = req.body;
    console.log(req.files);
    console.log(artwork);
    var id = artwork._id;

    console.log('Uploading Artist Data with', req.body, '---------------------\n');
    if (!artworkModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    artworkModel.findOneAndUpdate({ _id:artwork._id }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
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
    var artwork = req.body;
    console.log(req.files);
    console.log(artwork);
    var id = artwork._id;
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    console.log('set Purpose --->',set)

    if (!artworkModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    artworkModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(artwork._id) }, set, {upsert:true,multi: true}).exec(function(err, th) {
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
    artworkModel.findOne({_id: id}, function (err, artwork) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('artwork', artwork)
            const { artwork_photos } = artwork.files[0];
            if (artwork_photos) {
                if (artwork_photos) {
                    artwork_photos.forEach(file => {
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
                    artworkModel.deleteOne({_id:id},(err,object)=>{
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
                artworkModel.deleteOne({_id:id},(err,object)=>{
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