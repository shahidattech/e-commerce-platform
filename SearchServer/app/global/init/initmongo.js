var path = require('path');
var config = require(path.join(__dirname, '..', 'config', 'appConfig'));
var check = require(path.join(__dirname, '..', '..', 'util', 'checkTypes'));

var MongoClient = require('mongodb').MongoClient;
var url = config.db;
var mongo = {};

var logDb = {};

var connectMongo = function() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw new Error('Mongo client is not connected');
        }

        console.log("Connected to mongodb server.");
        mongo = db;
    });
};

exports.connectMongo = connectMongo;

exports.getMongoInstance = function() {
    //Retry, so next data instance call will be successful 
    if (check.isUndefinedOrEmpty(mongo))
        throw new Error("Mongo db connection object is not available.");

    return mongo;
}