var data = {};
var restify = require('restify');
var mongoose = require('mongoose');
var slideShowModel = require('mongoose').model('slideShowModel');
var url = require('url');

data.executeQuery = function(cursor, query, res, next, callback){
    cursor.find(query, function(err, result){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    });
};

module.exports = data;
