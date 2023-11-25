/* global __dirname */
var fs = require('fs');
var http = require('http');
var https = require('https');
var restify = require('restify');
var path = require('path');
var collectStat = require(path.join(__dirname, 'global', 'init', 'internal', 'collectStat'));
 var crossDomain = require(path.join(__dirname, 'global', 'init', 'api', 'crossDomain'));
//var parser = require(path.join(__dirname, 'global', 'init', 'api', 'parser'));
var throttle = require(path.join(__dirname, 'global', 'init', 'api', 'throttle'));
global.config = require(path.join(__dirname, 'global', 'config', 'appConfig'));
var express = require('express');
var bodyParser  = require('body-parser');
var router = express.Router();
var cors= require('cors');
global.__basedir = __dirname;
global.middleware  = require(path.join(__dirname, 'Middleware', 'CommonMiddlewares'));

//console.log(middleware);
if (config.SSLOn === true) {
    app = restify.createServer({
        certificate: fs.readFileSync(path.join(__dirname, '..', 'keys', 'server.crt')),
        key: fs.readFileSync(path.join(__dirname, '..', 'keys', 'server.key')),
        name: 'BaiAdminServer',
        version: config.currentVersion
    });
} else {
    app = restify.createServer({
        name: 'BaiAdminServer',
        version: config.currentVersion
    });
}

/* Collect statistical data from route calls */
collectStat(app);

// /* Cross Domain Access */
 crossDomain(app);

// /* Middleware parsers */
 // parser(app);
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true, parameterLimit:50000}));
/* Global error handler */
// globalErrorHandler(app);
app.use(cors({
  origin:['http://localhost:4200','http://localhost:7001'],
  credentials:true
}));
 //Connect to the primary database 
require(path.join(__dirname, 'global', 'init', 'data', 'mongoose'))(config);

//mongodb - Client
var db = require(path.join(__dirname, 'global', 'init', 'data', 'mongodb'));
db.initDb();

/* Connect to the Redis instance */
var redisDatabase = require(path.join(__dirname, 'global', 'init', 'data', 'redis'));
redisDatabase.startRedis();

/* Throttle http request burst - Denial of service */
throttle(app, redisDatabase);
app.use(express.static('resources'));
app.use(express.json());

/* Initiate route instances */
require(path.join(__dirname, 'global', 'init', 'api', 'routes'))(app);

//Allow cross domain access
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
// parse application/x-www-form-urlencoded

/* Start listening */
if (config.SSLOn === true) {
    app.listen(config.httpsPort, function() {
        console.log(app.name, ' SSL on listening at ', app.url);
    });
} else {
    app.listen(config.httpPort, function() {
       // console.log(config.httpPort);
        console.log(app.name, ' listening at ', app.url);
    });
}


/* Initiate search server connection */
//var searchIndex = require(path.join(__dirname, 'internal', 'searchClient'));
//searchIndex.initSearchClient();