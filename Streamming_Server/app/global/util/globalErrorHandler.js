var path = require('path');
var logger = require(path.join(__dirname, 'logger'));
var appConfig = require(path.join(__dirname, '..', 'config', 'appConfig'));
var emailService = require(path.join(__dirname, '..', '..', 'service', 'emailService'));

module.exports = function(app) {


    app.on('uncaughtException', function(err, req, res, next) {

        console.log('error details =======', err);

        var logDetails = {
            logType: 'Exception - Uncaught Global Route Exception',
            details: {
                error: err,
                stack: err.stack,
                url: req.url,
                body: req.body,
                query: req.query,
                params: req.params
            }
        };

        if (appConfig.env != 'dev')
            emailService.sendExceptionEmails(logDetails);

        logger.error(logDetails);
        err.body = 'Internal exception.';

        res.status(400);
        res.send(err);

        return next();
    });

    /* Uncaught exception for the entire app instance */
    process.on('uncaughtException', function(err) {

        console.log('error details +++++++', err);

        var logDetails = {
            logType: 'Uncaught Global Process Exception',
            details: {
                error: err,
                stack: err.stack,
            }
        };

        if (appConfig.env != 'dev')
            emailService.sendExceptionEmails(logDetails);

        logger.error(logDetails);

        err.body = 'Internal exception.';

        /* Stop process for a clean restart */
        //process.exit(1);
    });
};