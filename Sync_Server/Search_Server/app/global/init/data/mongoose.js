/* global __dirname */
var mongoose = require('mongoose');
var path = require('path');
var articleModel = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleModel'));
var authorModel = require(path.join(__dirname, '..', '..', '..', 'models', 'author', 'authorModel'));
var artistModel = require(path.join(__dirname, '..', '..', '..', 'models', 'artist', 'artistModel'));
var userModel = require(path.join(__dirname, '..', '..', '..', 'models', 'user', 'userModel'));


module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('artinfo db opened');
    });
};