var restify = require('restify');
var travelprofileModel = require('mongoose').model('travelprofileModel');
var mongoose = require('mongoose');

exports.travelprofilePhotos = function (req, res, next){
    var travelprofileData = req.body;
    console.log(req.files);
    console.log(travelprofileData);
    var id = travelprofileData._id;

    console.log('Uploading events Data with', req.body, '---------------------\n');
    if (!travelprofileModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    travelprofileModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(travelprofileData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
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