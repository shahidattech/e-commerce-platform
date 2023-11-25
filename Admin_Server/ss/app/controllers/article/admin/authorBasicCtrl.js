var restify = require('restify');
var authorModel = require('mongoose').model('authorModel');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');
//var featureCheck = require('../../../service/auth/featureChecker');


exports.createAuthor = function (req, res, next) {
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    var authorData = req.body;

    console.log('Creating Author Data with', authorData);
    var authorDatas = new authorModel({

        author: authorData.author,
        authorName: authorData.authorName,
        authorTitle: authorData.authorTitle,
        authorDescription: authorData.authorDescription

      });

    authorDatas.save(function(err){
      if(err) console.log('dd' + err); 
    });
    //log applicationForm
   console.log(JSON.stringify(authorDatas, null, 30));
    
    res.send(authorDatas);



}


// This function gets the details of Articles
exports.getAuthor = function (req, res, next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    var cursor = authorModel;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find(function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(objs);
            }
        });
    }    
}