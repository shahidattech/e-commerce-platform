var data = {};
var restify = require('restify');
var mongoose = require('mongoose');
var slideShowModel = require('mongoose').model('slideShowModel');
var url = require('url');
data.executeQuery = function(cursor, query, res, next, callback){
    console.log(query);
    //var numberOfDaysToLookBack = req.query.days ? req.query.days : 1;
   //callback(numberOfDaysToLookBack);
    slideShowModel.find(query, function(err, result){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    }).find({views:{$gte: 0}}).sort([['added_date', 1]]).limit(4);
};

module.exports = data;