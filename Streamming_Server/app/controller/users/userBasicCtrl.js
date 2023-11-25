var restify = require('restify');
var usersModel = require('mongoose').model('usersModel');
var mongoose = require('mongoose');

exports.usresPhotos = function (req, res, next){
    var usersData = req.body;
    console.log(req.files);
    console.log(usersData);
    var id = usersData._id;

    console.log('Uploading events Data with', req.body, '---------------------\n');
    if (!usersModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    usersModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(usersData._id) }, {$push:{ files:req.files}}, {new: true, useFindAndModify: false}).exec(function(err, th) {
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