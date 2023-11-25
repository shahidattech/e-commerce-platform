var restify = require('restify');
var travelcityModel = require('mongoose').model('travelcityModel');
var mongoose = require('mongoose');

exports.travelcityPhotos = function (req, res, next){
    var travelcityData = req.body;
    console.log(req.files);
    console.log(travelcityData);
    var id = travelcityData._id;

    console.log('Uploading events Data with', req.body, '---------------------\n');
    if (!travelcityModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    travelcityModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(travelcityData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
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