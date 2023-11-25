var data = {};
var restify = require('restify');
var mongoose = require('mongoose');
var articleModel = require('mongoose').model('articleModel');
var url = require('url');
data.executeQuery = function(cursor, query, res, next, callback){
    console.log(query);
    //var numberOfDaysToLookBack = req.query.days ? req.query.days : 1;
   //callback(numberOfDaysToLookBack);
    articleModel.find(query, function(err, result){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    }).find({added_date:{$gte: new Date(new Date().setDate(new Date().getDate()-1))},views:{$gte: 0}}).sort([['added_date', -1]]).limit(6);
};

module.exports = data;