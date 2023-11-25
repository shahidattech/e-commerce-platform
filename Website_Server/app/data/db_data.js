var data = {};
var restify = require('restify');
var mongoose = require('mongoose');
var articleModel = require('mongoose').model('articleModel');
var url = require('url');
data.executeQuery = function(cursor, query, res, next, callback){

	
    articleModel.find(query, function(err, result){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    }).find({"Published":'Published'}).sort({$natural:-1});
};

module.exports = data;

// data.executeQuery = function(cursor, query, res, next, callback){
//     cursor.find(query, function(err, result){
//         if (err) {
//             return next(new restify.errors.InternalServerError(err));
//         } else {
//             res.status(200);
//             callback({"result":result});
//         }
//     });
// };