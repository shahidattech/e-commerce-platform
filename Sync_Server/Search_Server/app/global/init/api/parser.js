const restify = require('restify');
//var validate = require('restify-api-validation');
global.httpErrors = restify.errors;

var os = require('os');

module.exports = function (app) {
    // app.use(restify.plugins.bodyParser());  
     app.use(restify.plugins.acceptParser(app.acceptable));
    app.use(restify.plugins.queryParser({
     mapParams: false
    }));
    app.use(restify.plugins.fullResponse());
    app.use(restify.plugins.gzipResponse());
    // Parse server known types /
    // app.use(restify.plugins.acceptParser(app.acceptable));
    // console.log(app.acceptable);
    // // Parses HTTP query string /
    // app.use(restify.plugins.queryParser({ mapParams: false}));
    // // Parses HTTP request body /
    // app.use(restify.plugins.multipartBodyParser(
    //     {
    //         //maxBodySize: 100000000000000 // Restrict to 1 MB data size /    
    //          // maxBodySize: 50 * 1024,
    //            mapParms: true,
    //            mapFiles: true,
    //            keepExtensions: true,
    //            uploadDir: os.tmpdir(),
    //           multipart: true,
    //             urlencoded: true, // Urlencoded content parsing
    //              encoding: 'utf8',        
    //     }
    // ));
       
    // Remove redundant slashes from route paths /
   // app.pre(restify.pre.sanitizePath());   
    
    // Zip server response objects /
    //app.use(restify.gzipResponse());
};

// prefix timestamp at log /
// var originalConsoleLog = console.log;
// global.console.log = function() {
//     args = [];
//     dateTimeOption = {
//     year: "numeric", month: "short",
//     day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
// };
//     args.push( '\x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
//     // Note: arguments is part of the prototype
//     for( var i = 0; i < arguments.length; i++ ) {
//         args.push( arguments[i] );
//     }
//     originalConsoleLog.apply( console, args );
// };


// // prefix timestamp at log /
// var originalConsoleError= console.error;
// global.console.error = function() {
//     args = [];
//     dateTimeOption = {
//     year: "numeric", month: "short",
//     day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
// };
//     args.push( '\033[31merror: \033[91m \x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
//     // Note: arguments is part of the prototype
//     for( var i = 0; i < arguments.length; i++ ) {
//         args.push( arguments[i] );
//     }
//     originalConsoleError.apply( console, args );
// };

// // prefix timestamp at log /
// var originalConsoleInfo= console.info;
// global.console.info = function() {
//     args = [];
//     dateTimeOption = {
//     year: "numeric", month: "short",
//     day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
// };
//     args.push( '\x1b[32minfo: \033[91m \x1b[36m[' + (new Date).toLocaleTimeString("en-US",dateTimeOption) + ']\x1b[0m' );
//     // Note: arguments is part of the prototype
//     for( var i = 0; i < arguments.length; i++ ) {
//         args.push( arguments[i] );
//     }
//     originalConsoleInfo.apply( console, args );
// };