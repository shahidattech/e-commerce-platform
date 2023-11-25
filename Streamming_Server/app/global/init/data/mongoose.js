/* global __dirname */
var mongoose = require('mongoose');
var path = require('path');
var uploadPath = require(path.join(__dirname, '..', '..', '..', 'models', 'uploadPath'));
var articleModel = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleModel'));
var productModel = require(path.join(__dirname, '..', '..', '..', 'models', 'product', 'productModel'));
var homeConfigModel = require(path.join(__dirname, '..', '..', '..', 'models', 'home-config', 'homeConfigModel'));
//var userModel = require(path.join(__dirname, '..', '..', '..', 'models', 'user', 'userModel'));
var artistModel = require(path.join(__dirname, '..', '..', '..', 'models', 'artists', 'artistsModel'));

var eventsModel = require(path.join(__dirname, '..', '..', '..', 'models', 'events', 'eventsModel'));
var artworkModel = require(path.join(__dirname, '..', '..', '..', 'models', 'artwork', 'artworkModel'));
var entityProfileLocationModel = require('../../../models/entitylocationprofile/entityLocationProfileModel')

var travelprofileModel = require(path.join(__dirname, '..', '..', '..', 'models', 'travelprofile', 'travelprofileModel'));
var travelcityModel = require(path.join(__dirname, '..', '..', '..', 'models', 'travelcity', 'travelcityModel'));
var trendprofileModel = require(path.join(__dirname, '..', '..', '..', 'models', 'trend', 'trendprofileModel'));
var slideShowModel = require(path.join(__dirname, '..', '..', '..', 'models', 'slideShow', 'slideShowModel'));

module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db);


    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('MediaServer db opened');
    });
};
