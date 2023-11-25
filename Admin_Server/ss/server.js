/* global __dirname */
var fs = require('fs');
var http = require('http');
var https = require('https');
var restify = require('restify');
var express = require('express');
var path = require('path');
var collectStat = require(path.join(__dirname,'app', 'global', 'init', 'internal', 'collectStat'));
var crossDomain = require(path.join(__dirname,'app', 'global', 'init', 'api', 'crossDomain'));
var parser = require(path.join(__dirname,'app', 'global', 'init', 'api', 'parser'));
var throttle = require(path.join(__dirname,'app', 'global', 'init', 'api', 'throttle'));
global.config = require(path.join(__dirname,'app', 'global', 'config', 'appConfig'));
var app = express();
var router = express.Router();
var upload = require('./app/config/multer.config.js');
var mongoose = require('mongoose');
global.__basedir = __dirname;
console.log(upload);
app.use(express.static('resources'));

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

// /* Collect statistical data from route calls */
// collectStat(app);

//  Cross Domain Access 
// crossDomain(app);

// /* Middleware parsers */
// parser(app);

/* Connect to the Redis instance */
// var redisDatabase = require(path.join(__dirname, 'app', 'global', 'init', 'data', 'redis'));
// redisDatabase.startRedis();

// /* Throttle http request burst - Denial of service */
// throttle(app, redisDatabase);

require('./app/routers/file.router.js')(app, router, upload);
mongoose.connect('mongodb://localhost:27017/mithlesh', {useNewUrlParser: true});
//Allow cross domain access
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
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