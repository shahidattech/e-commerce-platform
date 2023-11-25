var restify = require('restify');
var data = {};

data.executeQuery = function(cursor, query, res, next, callback){
    console.log(query);
    cursor.find(query, function(err, result){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    }).sort([['added_date', -1]]).limit(3);
};

module.exports = data;