var restify = require('restify');
var trendsModel = require('mongoose').model('trendsModel');
var mongoose = require('mongoose');

exports.trendprofilePhotos = function (req, res, next){
    var trendprofileData = req.body;
    console.log(req.files);
    console.log(trendprofileData);
    var id = trendprofileData._id;

    console.log('Uploading trend Data with', req.body, '---------------------\n');
    if (!trendsModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    trendsModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(trendprofileData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
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