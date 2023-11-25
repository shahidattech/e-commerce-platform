var path = require('path');
var appConfig = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));
var logger = require(path.join(__dirname, '..', 'global', 'util', 'logger'));
var aws = require('aws-sdk');
var ses = null;

var getEmailService = function() {
    if (ses == null) {
        ses = new aws.SES({
            "apiVersion": appConfig.sesApiVersion,
            "accessKeyId": appConfig.sesUser,
            "secretAccessKey": appConfig.sesSecKey,
            "region": appConfig.sesRegion,
            "maxRetries": 5,
            "retryDelayOptions": { "base": 2000 }
        });
    }

    return ses;
}

exports.sendExceptionEmails = function(data) {

    var mailOptions = {
        Destination: {
            ToAddresses: [appConfig.Support_Email]
        },
        Message: {
            Body: {
                Html: {
                    Data: emailBodyDetails(data),
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: emailSubject(),
                Charset: 'UTF-8'
            }
        },
        Source: appConfig.Support_Email
    };

    getEmailService().sendEmail(mailOptions, function(err, data) {
        if (err) {
            logger.error({
                logType: 'Exception - Email. Stream',
                details: {
                    error: err.message,
                    stack: err.stack
                }
            });
        }
    });
}

function emailBodyDetails(data) {
    var logMsg = '<p style="color: red; font-weight: bold">' + data.logType + '</p>';
    logMsg += '<p style="color: red; font-weight: bold"> Error: ' + data.details.error + '</p>';
    logMsg += '<p style="color: blue"> Stack: ' + data.details.stack + '</p>';
    logMsg += '<p> Route: ' + data.details.route + '</p>';
    logMsg += '<p> Content: ' + JSON.stringify(data.details.content) + '</p>';
    logMsg += '<p> Params: ' + JSON.stringify(data.details.params) + '</p>';
    logMsg += '<p> Body: ' + JSON.stringify(data.details.body) + '</p>';

    return logMsg;
}

function emailSubject() {
    return 'Stream - Env - ' + appConfig.env + ' ' + new Date();
}