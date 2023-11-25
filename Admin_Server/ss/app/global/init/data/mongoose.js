/* global __dirname */
var mongoose = require('mongoose');
var path = require('path');
var articleModel = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleModel'));
var authorModel = require(path.join(__dirname, '..', '..', '..', 'models', 'author', 'authorModel'));
var artistModel = require(path.join(__dirname, '..', '..', '..', 'models', 'artist', 'artistModel'));
var userModel = require(path.join(__dirname, '..', '..', '..', 'models', 'user', 'userModel'));
var administrationModel = require(path.join(__dirname, '..', '..', '..', 'models', 'administration', 'administrationModel'));
var tagModel = require(path.join(__dirname,'..', '..', '..', 'models', 'tag', 'tagModel'));
var eventsModel = require(path.join(__dirname,'..', '..', '..', 'models', 'events', 'eventsModel'));
var artworkModel = require(path.join(__dirname,'..', '..', '..', 'models', 'artwork', 'artworkModel'));
var EntityLocationProfileModel = require(path.join(__dirname,'..', '..', '..', 'models', 'entitylocationprofile', 'entityLocationProfileModel'));
var articleHome = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleHome'));
var slideshowHome = require(path.join(__dirname, '..', '..', '..', 'models', 'slideShow', 'slideshowHome'));
var siteConfigHome = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'siteConfigHome'));
var travelprofileModel = require(path.join(__dirname, '..', '..', '..', 'models', 'travelprofile', 'travelprofileModel'));
var slideShowHome = require(path.join(__dirname, '..', '..', '..', 'models', 'slideShow', 'slideShowModel'));
var travelcityModel = require(path.join(__dirname, '..', '..', '..', 'models', 'travelcity', 'travelcityModel'));
var trendModel = require(path.join(__dirname, '..', '..', '..', 'models', 'trend', 'trendModel'));

module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('artinfo db opened');
    });
};