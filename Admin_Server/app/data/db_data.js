var restify = require('restify');
var data = {};

data.executeQuery = function(cursor, query, res, next, callback){
    console.log(query);
    cursor.find(query).lean(true).exec((err, result)=>{
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            callback({"result":result});
        }
    });
};

module.exports = data;
