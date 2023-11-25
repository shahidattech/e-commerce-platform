// var path = require('path');
// var config = require(path.join(__dirname,'..','config','appConfig'));
// var MongoClient = require('mongodb', { useNewUrlParser: true }).MongoClient;
// var mongoUrl = config.mongodbClient;
// // var teacherSalaryModel = require(path.join(__dirname,'..','..','models','misc','teacherSalaryModel'))
// var dbInstance = {};

// exports.initDb = function () {    
//     MongoClient.connect(mongoUrl, function (err, db) {
//         if(err){
//             throw err;
//         }        
//         console.log('Mongodb  connected');        
//         dbInstance = db;                
//     });
// };
// exports.getDb = function () {
//     return dbInstance;
// };



var MongoClient = require('mongodb').MongoClient;
var dbInstance = {};

exports.initDb = function (config) {     
    MongoClient.connect(config.db, function (err, db) {
        if(err){
            throw err;
        }
        
        console.log('Mongodb connected');
        
        dbInstance = db;                
    });
}

exports.getDb = function () {
    return dbInstance;
}