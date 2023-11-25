/* global process */
/* global __dirname */
var fs = require('fs');
var http = require('http');
var https = require('https');
var restify = require('restify');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require(path.join(__dirname, 'global', 'util', 'logger'));
var os = require('os'); 
os.tmpDir = os.tmpdir;
var app = express();
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static('/usr/lib/cgi-bin/'));
global.__basedir = __dirname;
global.middleware  = require(path.join(__dirname, 'Middleware', 'CommonMiddlewares'));
var config = require(path.join(__dirname, 'global', 'config', 'appConfig'));
var globalErrorHandler = require(path.join(__dirname, 'global', 'util', 'globalErrorHandler'));

// mongoose.connect('mongodb+srv://mybrand:globalpass@cluster0.8vbbk.mongodb.net/mybrand?retryWrites=true&w=majority', { useNewUrlParser: true }, function(err){
  mongoose.connect(config.db, { useNewUrlParser: true }, function(err){
 if(err){
    console.log('Not stablish mongoose');
 }else{
  console.log('Mongooes connected');
 }
});

require("./models/uploadPath");
require('./models/article/articleModel');
require('./models/product/productModel');
require('./models/home-config/homeConfigModel');
// require('./models/article/articleHome');
require('./models/artists/artistModel');
require('./models/artwork/artworkModel');
require('./models/events/eventsModel');
require('./models/entitylocationprofile/entityLocationProfileModel');
require('./models/travelprofile/travelprofileModel');
require('./models/trend/trendprofileModel');
require('./models/travelcity/travelcityModel');
require('./models/users/usersModel');
require('./models/slideshow/slideShowModel');
require('./models/slider/sliderModel');

//Allow cross domain access
app.use(function(req, res, next) {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Authorization,Accept, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

var redisDatabase = require(path.join(__dirname, 'global', 'init', 'redis'));
redisDatabase.connectRedis();

//passport.use('local-register', localStrategy.register);
//passport.use('local-login', passport.login);
/* Connect to the primary database */
// require(path.join(__dirname, 'global', 'init', 'data', 'mongoose'))(config);
// //mongodb - Client
//  require(path.join(__dirname, 'global', 'config', 'mongo-db')).initDb(config);
// db.initDb();

// require(path.join(__dirname, 'global', 'config', 'mongo-db')).initDb(config);
require(path.join(__dirname, 'routes', 'routes'))(app);
require(path.join(__dirname, 'routes', 'articleApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'artworkApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'artistsApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'eventsApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'travelprofileApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'travelcityApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'trendApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'usersApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'slideshowApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'streammingApi'))(app);
require(path.join(__dirname, 'routes', 'entityLocationApi'))(app,middleware);
require(path.join(__dirname, 'routes', 'productApi'))(app, middleware);
require(path.join(__dirname, 'routes', 'sliderApi'))(app, middleware);

/* Global error handler */
globalErrorHandler(app)

//var storageManager = require(path.join(__dirname, 'global', 'init', 'storageManager'));
//storageManager.initStorage(config);

if (config.SSlOn == true) {
    var privateKey = fs.readFileSync(path.join(__dirname, '..', 'keys', 'server.key'));
    var certificate = fs.readFileSync(path.join(__dirname, '..', 'keys', 'server.crt'));
    var credentials = { key: privateKey, cert: certificate };
    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(config.httpsPort);

    //app.listen(config.port);

    console.log('SSL on Listening on port ' + config.httpsPort + '...');
} else {
    var httpServer = http.createServer(app);
    //console.log(httpServer);
    httpServer.listen(config.httpPort);

    console.log('Listening on port ' + config.httpPort + '...');
}