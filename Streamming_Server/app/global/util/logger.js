/* global __dirname */
/* global process */
var path = require('path');
var winston = require('winston');
var winstonMongo = require('winston-mongodb').MongoDB;
winston.emitErrs = true;

var config = require(path.join(__dirname, '..', 'config', 'appConfig'));

var logger = new winston.Logger({
    transports: [
        // new winston.transports.File({
        //     level: 'info',
        //     filename: path.join(__dirname, '..', '..', '..', 'logs', 'all-logs.log'),
        //     handleExceptions: true,
        //     json: true,
        //     maxsize: 5242800, //5MB
        //     maxFiles: 5,
        //     colorize: true
        // }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        // new winston.transports.MongoDB({
        //     level: 'verbose',
        //     db: config.logdb,
        //     collection: 'streamserverlog',
        //     handleExceptions: true,
        //     json: false,
        //     colorize: true
        // })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};


/* prefix timestamp at log */
var originalConsoleLog = console.log;
console.log = function() {
    args = [];
    dateTimeOption = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};
    args.push( '\x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
    // Note: arguments is part of the prototype
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    originalConsoleLog.apply( console, args );
};

/* prefix timestamp at log */
var originalConsoleError= console.error;
global.console.error = function() {
    args = [];
    dateTimeOption = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};
    args.push( '\033[31merror: \033[91m \x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
    // Note: arguments is part of the prototype
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    originalConsoleError.apply( console, args );
};

/* prefix timestamp at log */
var originalConsoleInfo= console.info;
global.console.info = function() {
    args = [];
    dateTimeOption = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};
    args.push( '\x1b[32minfo: \033[91m \x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
    // Note: arguments is part of the prototype
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    originalConsoleInfo.apply( console, args );
};