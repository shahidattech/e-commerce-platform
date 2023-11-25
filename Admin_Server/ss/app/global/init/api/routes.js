/* global __dirname */
var path = require('path');
var userApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'userAccount', 'userApi'));
var authApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'userAccount', 'authApi'));
var articleApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'article', 'articleApi'));
var authorApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'author', 'authorApi'));
var tagsApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'tags', 'tagsApi'));
var artistApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'artist', 'artistApi'));
var eventsApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'events', 'eventsApi'));
var travelprofileApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'travelprofile', 'travelprofileApi'));
var artworkApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'artwork', 'artworkApi'));
var EntityLocationProfileModelApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'EntityLocationProfile', 'EntityLocationProfileModelApi'));
var administrationApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'administration', 'administrationApi'));
var slideShowApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'slideShow', 'slideShowApi'));
//var tagApi = require("../../../routes/")
var travelcityApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'travelcity', 'travelcityApi'));
var siteconfigApi = require(path.join(__dirname,'..','..','..','routes', 'siteconfiguration', 'siteconfigurationApi'));
var trendprofileApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'trend', 'trendprofileApi'));

module.exports = function(app) {
//console.log(middleware)
    //User authentication management
    authApi(app);
    //User data management
    userApi(app,middleware);
    tagsApi(app);
    //Handle Article
    artworkApi(app,middleware);
    articleApi(app,middleware);
    eventsApi(app,middleware);
    authorApi(app);
    slideShowApi(app,middleware);
    EntityLocationProfileModelApi(app,middleware);
    artistApi(app,middleware);
    travelprofileApi(app,middleware);
    travelcityApi(app,middleware);
    trendprofileApi(app,middleware);
   administrationApi(app);
   siteconfigApi(app);
   
};