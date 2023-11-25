var _ = require('lodash');
var fs = require('fs');
var jwt = require('jwt-simple');

var path = require('path');
var restify = require('restify');
var User = require('mongoose').model('User');
var Teacher = require('mongoose').model('Teacher');
var Student = require('mongoose').model('Student');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var envConfig = require(path.join(__dirname, '..', '..', 'global', 'config', 'appConfig'));
var emailTemplate = require(path.join(__dirname, '..', '..', 'service', 'email', 'generateTemplate'));
var emailService = require(path.join(__dirname, '..', '..', 'service', 'email', 'emailService'));
var il = require(path.join(__dirname, '..', '..', 'service', 'exception', 'internalLogger'));

var codes = require(path.join(__dirname, '..', '..', 'service', 'payment', 'paytm', 'respMsg'));


exports.sendResetPwd = function(req, res, next) {
    var email = req.body.email;
    var payload = {
        sub: email,
        exp: moment().add(envConfig.pwdResetExpTime, 'minutes').valueOf()
    };

    User.findOne({
        userName: email
    }).exec(function(err, foundUser) {
        if (err) return res.status(500);
        if (!foundUser) {
            return next(new restify.errors.UnauthorizedError('User not found'));
        }
        if (!foundUser.active)
            foundUser.active = true;

        var roleUser = "";
        if (foundUser.userRole == 'teacher') {
            roleUser = require('mongoose').model('Teacher');
        } else
            roleUser = require('mongoose').model('Student');

        roleUser.findOne({
            userName: email
        }).exec(function(err, found) {
            if (err)
                return next(new restify.errors.InternalServerError(err));
            if (found.contacts.phoneNo != req.body.phoneNo)
                return next(new restify.errors.UnauthorizedError('Invalid Phone Number'));

            var token = jwt.encode(payload, envConfig.EMAIL_SECRET);

            emailService.sendEmail(
                email,
                envConfig.Contact_Email,
                emailTemplate.getHtmlPwdReset(token),
                'ApnaStudy Password Reset',
                function(err) {
                    if (err)
                        return next(new restify.errors.InternalServerError(err));

                    next();
                });
        });
    });
};

exports.handlerResetPwd = function(req, res, next) {
    var token = req.query.token;
    var payload = jwt.decode(token, envConfig.EMAIL_SECRET);
    var email = payload.sub;

    if (!email || payload.exp <= Date.now()) {
        return res.redirect(envConfig.Client_Domain + '/#/resetpasswordfail', next);
    } else {
        User.findOne({
            userName: email
        }).exec(function(err, foundUser) {
            if (err) return res.status(500);
            if (!foundUser) {
                return res.redirect(envConfig.Client_Domain + '/#/resetpasswordfail', next);
            }

            // if (!foundUser.active)
            //     foundUser.active = true;
            foundUser.save(function(err) {
                if (err)
                    return res.redirect(envConfig.Client_Domain + '/#/resetpasswordfail', next);

                var url = envConfig.Client_Domain + '/#/resetpassword/?token=' + token;
                return res.redirect(url, next);
            });
        });
    }
};

function sendAccountVerify(req, res, next) {
    var email = req.body.userName;
    var phoneNo = req.body.phoneNo;
    var userRole = req.body.userRole;

    var payload = {
        sub: {
            email: email,
            phoneNo: phoneNo,
            userRole: userRole
        },
        exp: moment().add(envConfig.emailVerifyExpTime, 'minutes').valueOf()
    };

    var token = jwt.encode(payload, envConfig.EMAIL_SECRET);

    emailService.sendEmail(
        email,
        envConfig.Contact_Email,
        emailTemplate.getHtmlVerifyMail(token),
        'ApnaStudy Account Verfication',
        function(err, response) {

            console.log('err', err);
            console.log('res', response);

            if (err)
                return next(new restify.errors.InternalServerError(err));

            next();
        });
}

exports.sendAccountVerify = sendAccountVerify;

exports.resendAccountVerify = function(req, res, next) {
    sendAccountVerify(req, res, function() {
        res.status(200);
        res.send(true);
        next();
    });
};

//this wont have user role so need to query it
exports.resendAccountVerifyFromUI = function(req, res, next) {
    User.findOne({
        'userName': req.body.userName
    }, {
        'userRole': 1,
        _id: 0
    }, function(err, userRole) {
        if (err)
            return next(new restify.errors.InternalServerError(err));
        if (!userRole)
            return next(new restify.errors.UnauthorizedError('User does not exist'));

        req.body.userRole = userRole.userRole;

        sendAccountVerify(req, res, function() {
            res.status(200);
            res.send(true);
            next();
        });
    });


};

exports.handlerAccountVerify = function(req, res, next) {

    var token = req.query.token;
    var payload = jwt.decode(token, envConfig.EMAIL_SECRET);

    var email = payload.sub.email;
    var phoneNo = payload.sub.phoneNo;
    var userRole = payload.sub.userRole;

    if (!email || payload.exp <= Date.now()) {
        return res.redirect(envConfig.Client_Domain + '/#/verifyemailfail', next);
    } else {
        User.findOne({
            userName: email
        }).exec(function(err, foundUser) {
            if (err || !foundUser) {
                return res.redirect(envConfig.Client_Domain + '/#/verifyemailfail', next);
            }


            if (foundUser.active) {
                return res.redirect(envConfig.Client_Domain + '/#/verifiedmail', next);
            }

            if (userRole == 'teacher') {
                checkPhoneDuplicate(Teacher, function() {
                    updateUserInfo(Teacher, email, userStatusUpdate);
                });
            } else if (userRole == 'student') {
                checkPhoneDuplicate(Student, function() {
                    updateUserInfo(Student, email, userStatusUpdate);
                });
            }

            function userStatusUpdate() {
                if (!foundUser.active)
                    foundUser.active = true;

                if (foundUser.contacts)
                    foundUser.contacts.phoneNo = phoneNo;


                foundUser.save(function(err) {
                    if (err) {
                        return res.redirect(envConfig.Client_Domain + '/#/verifyemailfail', next);
                    } else {
                        sendWelcomeEmail(email);

                        return res.redirect(envConfig.Client_Domain + '/#/verifyemail', next);
                    }
                });
            }
        });

        function checkPhoneDuplicate(md, callback) {
            md.count({
                'contacts.phoneNo': phoneNo
            }, function(err, data) {
                if (err || data > 0) {
                    return res.redirect(envConfig.Client_Domain + '/#/verifyemailfail', next);
                }

                callback();
            });
        }

        function updateUserInfo(md, uName, callback) {
            md.findOneAndUpdate({
                    userName: uName
                }, {
                    "$set": {
                        "contacts.phoneNo": phoneNo,
                        "activity.dateOfActivation": new Date().toISOString()
                    }
                },
                function(err) {
                    if (err)
                        return res.redirect(envConfig.Client_Domain + '/#/verifyemailfail', next);

                    callback();
                });
        }
    }
};

function sendWelcomeEmail(email) {

    emailService.sendEmail(
        email,
        envConfig.Contact_Email,
        emailTemplate.getHtmlWelcomeMail(),
        'Welcome to ApnaStudy',
        function(err) {
            //if (err)
            //    return next(new restify.errors.InternalServerError(err));

        });
}

exports.sendWelcomeEmailSocialReg = function(req, res, next) {
    emailService.sendEmail(
        req.body.userName,
        envConfig.Contact_Email,
        emailTemplate.getHtmlWelcomeMailSocialReg(req.body.passwd),
        'Welcome to ApnaStudy',
        function(err) {
            if (err)
                return next(new restify.errors.InternalServerError(err));

            next();
        });
};

exports.paymentStatusEmail = function(isSuccess, payload, next) {

    if (!isSuccess) {
        payload.msg = _.find(codes, function(data) {
            return data.code == payload.code;
        }).message
    }

    emailService.sendEmail(
        payload.userName,
        envConfig.Contact_Email,
        emailTemplate.getHtmlPaymentStatusMail(isSuccess, payload),
        isSuccess === true ? 'ApnaStudy Payment - Successful' : 'ApnaStudy Payment - Failed',
        function(err) {
            if (err)
                return next(new restify.errors.InternalServerError(err));

            next();
        });
};

exports.sendContactUsEmail = function(req, res, next) {
    var params = req.body;
    var emailBody = '<h4>' + params.subject + '</h4></br><p>' + params.message + '</p><p> Email -' + params.email + '</p>';

    emailService.sendEmail(
        envConfig.Contact_Email,
        envConfig.Contact_Email,
        emailBody,
        'Contact ApnaStudy - ' + params.name,
        function(err) {
            res.status(200);

            if (err)
                res.send(false);
            else
                res.send(true);

            next();
        });
};

exports.sendClassCreationEmail = function(req, res, next) {
    var params = req.body;

    User.findOne({
        '_id': new ObjectId(req.userId)
    }, {
        'userName': 1,
        _id: 0
    }, function(err, data) {
        if (err) {
            il.logInternalExcep('Class creation send email user not found', 'emailCtrl.sendClassCreationEmail', { reqBody: req.body, userId: req.userId });
            next();
        }

        emailService.sendEmail(
            envConfig.Contact_Email,
            envConfig.Contact_Email,
            emailTemplate.classCreationHtml(req, data.userName),
            'Contact ApnaStudy - Class Creation Alert - ' + data.userName,
            function(err) {
                if (err) {
                    il.logInternalExcep('Class creation send email', 'emailCtrl.sendClassCreationEmail', { reqBody: req.body, userId: req.userId });
                }

                next();
            });
    });
};

exports.studentQueryMsg = function(req, res, next) {
    var params = req.body;
    var emailBody = '<span> <br/>Sub: - Student Query: Name - ' + params.name + '</span><span "><br/>' +
        'Email: ' + params.email + '<br/>' +
        'Phone: ' + params.phone + '<br/>' +
        params.message + '</span><br/><br/>';

    emailService.sendEmail(
        envConfig.Contact_Email,
        envConfig.Contact_Email,
        emailBody,
        'Contact ApnaStudy - ' + params.name,
        function(err) {
            res.status(200);

            if (err)
                res.send(false);
            else
                res.send(true);
        });
};

exports.sendSessionCreationMail = function(req, res, next) {

    if (envConfig.env != 'dev') {
        return next();
    }

    var scheduleData = req.body;
    Teacher.findOne({ _id: req.userId }, { userName: 1, profile: 1, _id: 0 }, function(err, teacherData) {
        if (err)
            return next(new restify.errors.InternalServerError(err));

        var toEmail = envConfig.Support_Email;
        var fromEmail = envConfig.ADMIN_EMAIL;
        var emailTitle = "class session created";
        var emailBody = "<h1> CLASS SESSION CREATED </h1>";
        emailBody += "<h2>CLASS NAME : " + req.body.className + "</h2>";
        emailBody += "<h2>Teacher Username : " + teacherData.userName + "</h2>";
        emailBody += "<h2>Teacher Name : " + teacherData.profile.firstName + " " + teacherData.profile.lastName + "</h2>";
        emailBody += "<h2>Session StartDateTime : " + moment(scheduleData.startDateTime).format('MMMM Do YYYY, h:mm:ss a') + "</h2>";
        emailBody += "<h2>Session EndDateTime : " + moment(scheduleData.endDateTime).format('MMMM Do YYYY, h:mm:ss a') + "</h2>";

        emailService.sendEmail(toEmail, fromEmail, emailBody, emailTitle, function() {
            next();
        });
    });
};

exports.sendVideoUploadMail = function(req, res, next) {

    if (req.body.resourceType == 'videos') {
        emailService.sendEmail(envConfig.Support_Email, envConfig.Support_Email, emailTemplate.resourceUpload(req.body),
            'Resource Uploaded -By ' + req.firstName + ' ' + req.lastName + ' -userId :  ' + req.userId,
            function(err) {
                if (err)
                    return next(new restify.errors.InternalServerError(err));

                next();
            });
    } else {
        return next();
    }

};

exports.sendPublicMessageMail = function(req, res, next) {
    var messageInfo = req.body;

    var emailContent = '<p>Sender:' + ' ' + messageInfo.senderUserName + '</p>' +
        '<p>Recipent:' + ' ' + messageInfo.receiverUserName + '</p>' +
        '<br><br>' + messageInfo.content;

    emailService.sendEmail(envConfig.Support_Email,
        envConfig.Contact_Email,
        emailContent,
        messageInfo.title,
        function(err) {
            if (err)
                return next(new restify.errors.InternalServerError(err));

            next();
        });
};


_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};