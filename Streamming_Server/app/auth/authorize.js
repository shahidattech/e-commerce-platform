/* global __dirname */
/* global process */
var path = require('path');
var _ = require('lodash-node');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;
var ck = require(path.join(__dirname, '..', 'global', 'util', 'typeValidation'));
var db = require(path.join(__dirname, '..', 'global', 'config', 'mongo-db'));
var config = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));

exports.validateClassResAccess = function(req, res, next) {
    if (req.userRole == 'teacher')
        return next();

    var classId = req.query.classId;

    //Validate required fields
    if (ck.isUndefinedOrEmpty(classId)) {
        return next('class id is missing');
    }


    var isStudent = req.userRole == 'student';
    var query = {
        "_id": new ObjectId(classId),
        "classEndDate": { $gte: new Date() },
        "students": {
            $elemMatch: {
                'studentUserId': new ObjectId(req.userId)
                // 'paymentInfo.currentPaymentStatus': 'Completed'
            }
        }
    };

    var classModel = db.getDb().collection('classmodels');

    if (ck.isUndefinedOrNullOrEmpty(classModel)) {
        return next('Class model not found');
    }

    classModel.findOne(query, { _id: 1, teacherId: 1 }, function(err, data) {
        if (err) {
            return next(err);
        }
        if (ck.isUndefinedOrNullOrEmpty(data)) {
            return next('Class not found');
        }

        req.teacherId = data.teacherId;
        next();
    });
};

exports.validateTestResAccess = function(req, res, next) {
    var testId = !req.query.testId ? req.body.testId : req.query.testId;
    var classId = !req.query.classId ? req.body.classId : req.query.classId

    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(testId)) {
        return next('Required parametes are missing');
    }

    var testModel = db.getDb().collection('tests');

    if (ck.isUndefinedOrNullOrEmptyOrNoLen(testModel)) {
        return next('Class model is not instantiated');
    }

    testModel.findOne({ _id: new ObjectId(testId) }, { _id: 1, teacherId: 1, assignedClasses: 1 },
        function(err, data) {
            if (err) {
                return next(err);
            }
            if (ck.isUndefinedOrNullOrEmpty(data)) { //test not found
                return next('Test not found');
            }

            if (data.teacherId == req.userId) //if teacher
                return next();
            else if (data.assignedClasses && data.assignedClasses.length > 0 &&
                !ck.isUndefinedOrNullOrEmptyOrNoLen(classId)) {

                req.teacherId = data.teacherId;

                var foundClass = _.find(data.assignedClasses, function(cl) {
                    return cl.classId == classId;
                });

                if (ck.isUndefinedOrNullOrEmptyOrNoLen(foundClass)) {
                    return next('Unauthorized test access');
                }

                var classModel = db.getDb().collection('classmodels');

                if (ck.isUndefinedOrNullOrEmptyOrNoLen(classModel)) {
                    return next('Class model instance not found');
                }

                var query = { _id: new ObjectId(classId) };
                query.students = {
                    $elemMatch: {
                        'studentUserId': new ObjectId(req.userId)
                        // 'paymentInfo.currentPaymentStatus': 'Completed'
                    }
                };
                query.classTests = {
                    $elemMatch: {
                        'testId': testId
                    }
                };

                classModel.findOne(query, { _id: 1, classTests: 1 }, function(err, cl) {

                    if (err) {
                        return next(err);
                    }
                    if (!cl) {
                        return next('No class found');
                    }

                    var studentParticipationNotAllowed = false;

                    if (cl.classTests && cl.classTests.length > 0) {

                        var classTest = _.find(cl.classTests, function(s) {
                            return s.testId == testId;
                        });

                        if (classTest.excludedStudentIds && classTest.excludedStudentIds.length > 0) {
                            studentParticipationNotAllowed = _.find(classTest.excludedStudentIds, function(s) {
                                return s == req.userId;
                            });

                            if (studentParticipationNotAllowed) {
                                return next('Not allowed for the test.');
                            }
                        }

                        if (classTest.testEndDateTime) {
                            var ms = moment(moment.utc()).diff(moment(classTest.testEndDateTime));
                            if (ms > 0) {
                                return next('Unauthorized test access');
                            }
                        }
                    } else {
                        return next('Unauthorized test access');
                    }

                    return next();
                });
            } else {
                return next('Unauthorized test access');
            }
        });
};

exports.validateMsgResAccess = function(req, res, next) {
    var msgId = !req.body.msgId ? req.query.msgId : req.body.msgId;

    //Validate required fields
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(msgId)) {
        return next('Required parameter is missing.');
    }

    var msgModel = db.getDb().collection('messages');

    if (ck.isUndefinedOrNullOrEmptyOrNoLen(msgModel)) {
        return next('Message model instance not found.');
    }

    msgModel.findOne({ _id: new ObjectId(msgId) }, function(err, data) {
        if (err || !data || !data.receiver || !data.sender) { //db error or class not found
            return next('Message not found.');
        }

        var isValid = data.receiver.userId == req.userId || data.sender.userId == req.userId;

        if (!isValid)
            return next('Invalid message access.');

        next();
    });
};

exports.verifyAdminRole = function(req, res, next) {
    if (req.userRole != 'teacher')
        return next('Admin authorization failed');

    next();
}

exports.verifyProfilePicAccess = function(req, res, next) {

    //Validate required fields
    if (ck.isUndefinedOrEmpty(req.body.fileName)) {
        return next('file name is missing');
    }

    var fileName = req.body.fileName;
    var userModel = db.getDb().collection('users');

    if (ck.isUndefinedOrNullOrEmpty(userModel)) {
        return next('user model not found');
    }

    var query = { '_id': new ObjectId(req.userId) };

    if (req.body.isCoverImg) {
        query['profile.coverName'] = fileName;
    } else {
        query['profile.pictureName'] = fileName;
    }

    userModel.count(query, getCountCallback);

    function getCountCallback(err, cnt) {
        if (err) {
            return next(err);
        }

        if (cnt == 0) {
            return next('Unauthorized resource access');
        }

        next();
    };
};