var path = require('path');
var restify = require('restify');
var _ = require('lodash');
var sucscriptionModel = require('mongoose').model('Subscription');
const { validationResult } = require('express-validator');
var logger = require('logger').createLogger();
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var subscriptionPlansJson = path.join(__dirname, '..', '..', '..', 'global', 'subscriptionPlans', 'subscriptionPlans.json');
var payuMoneyService = require(path.join(__dirname, '..', '..', '..', 'service', 'vendors', 'payuMoneyService'));
const moment = require('moment-timezone');
const fs = require('fs');
// const webClient = "http://localhost:4200/";
const webClient = "https://api.dynamicexecution.com/api/v1/";

exports.checkSubscription = (req, res, next) => {
    let checkSubscription_resp = {};
    var userId = req.params.userId;
    var cursor = sucscriptionModel;
    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else {
        cursor.findOne({ _id: userId }, function (err, th) {
            if (!err && th) {
                if (th.length == 0) {
                    checkSubscription_resp.status = 'error';
                    checkSubscription_resp.msg = 'Subscription Expired';
                    checkSubscription_resp.msg_info = 'Please pay the subscription first';
                    checkSubscription_resp.subscription_expire_date = null;
                    checkSubscription_resp.isExpired = true;
                    res.status(200);
                    res.send(checkSubscription_resp);
                } else {
                    console.log(th.subscription_expire_date);
                    if (th.subscription_expire_date) {
                        let isExpired = moment.tz(th.subscription_expire_date, "DD-MM-YYYY", "Asia/Kolkata").isBefore(moment.tz("Asia/Kolkata"));
                        if (isExpired) {
                            checkSubscription_resp.status = 'error';
                            checkSubscription_resp.msg = 'Subscription Expired';
                            checkSubscription_resp.msg_info = 'Please pay the subscription first';
                            checkSubscription_resp.subscription_expire_date = th.subscription_expire_date;
                            checkSubscription_resp.isExpired = true;
                            res.status(200);
                            res.send(checkSubscription_resp);
                        } else {
                            checkSubscription_resp.status = 'success';
                            checkSubscription_resp.msg = 'Subscription Valid';
                            checkSubscription_resp.msg_info = 'Subscription Valid';
                            checkSubscription_resp.subscription_expire_date = th.subscription_expire_date;
                            checkSubscription_resp.isExpired = false;
                            res.status(200);
                            res.send(checkSubscription_resp);
                        }
                    } else {
                        checkSubscription_resp.status = 'error';
                        checkSubscription_resp.msg = 'Subscription Expired';
                        checkSubscription_resp.msg_info = 'Please pay the subscription first';
                        checkSubscription_resp.subscription_expire_date = null;
                        checkSubscription_resp.isExpired = true;
                        res.status(200);
                        res.send(checkSubscription_resp);
                    }
                }
            } else {
                checkSubscription_resp.status = 'error';
                checkSubscription_resp.msg = 'Server Error!!';
                checkSubscription_resp.msg_info = 'Please try after sometime';
                checkSubscription_resp.subscription_expire_date = null;
                checkSubscription_resp.isExpired = true;
                res.status(200);
                res.send(checkSubscription_resp);
            }
        });
    }
}


exports.getSubscriptionContent = function (req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let subscriptionContent_resp = {};
            subscriptionContent_resp.status = 422;
            subscriptionContent_resp.data = errors;
            res.send(subscriptionContent_resp);
        }
        else {
            let subscriptionContent_resp = {};
            let productInputData = req.body;

            fs.readFile(subscriptionPlansJson, (err, data) => {
                if (err) {
                    subscriptionContent_resp.status = 'error';
                    subscriptionContent_resp.data = null;
                    subscriptionContent_resp.message = 'Internal Server error! ';
                    res.send(subscriptionContent_resp);
                } else {
                    subscriptionContent_resp = JSON.parse(data);
                    // console.log(subscriptionContent_resp);
                    res.status(200);
                    res.send({ 'status': 'success', 'message': 'subscription details', 'data': subscriptionContent_resp });
                }
            });



        }
    } catch (error) {
        let subscriptionContent_resp = {};
        console.log('create prod=', error);
        subscriptionContent_resp.status = 'error';
        subscriptionContent_resp.data = null;
        subscriptionContent_resp.message = 'Internal Server error!';
        res.send(subscriptionContent_resp);
    }
}


exports.subscriptionAdd = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let subscriptionAdd_resp = {};
            subscriptionAdd_resp.status = 422;
            subscriptionAdd_resp.data = errors;
            // res.status(422);
            res.send(subscriptionAdd_resp);
        }
        else {
            let subscriptionAdd_resp = {};
            let inputData = req.body;

            sucscriptionModel.findById({ _id: inputData.userId }, function (err, result) {
                if (err) {
                    subscriptionAdd_resp.status = 422;
                    subscriptionAdd_resp.data = 'Error occurred while Adding subscription!!';
                    res.send(subscriptionAdd_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {

                        subscriptionAdd_resp.status = 500;
                        subscriptionAdd_resp.data = "already added";
                        res.send(subscriptionAdd_resp);

                    }
                    else {
                        prodDoc = new sucscriptionModel();
                        console.log('inputData.userId', inputData.userId);
                        prodDoc._id = inputData.userId;
                        prodDoc.save(function (err, justPushedDocument) {
                            if (err) {
                                console.log('Err creting first prod', err);
                                subscriptionAdd_resp.status = 500;
                                subscriptionAdd_resp.data = ' Error while adding the first document!';
                                res.send(subscriptionAdd_resp);
                            }
                            else {
                                subscriptionAdd_resp.status = 200;
                                subscriptionAdd_resp.data = justPushedDocument;
                                res.send(subscriptionAdd_resp);
                            }
                        });
                    }
                }
            });
        }
    } catch (error) {
        let subscriptionAdd_resp ={};
        console.log('create subscription=', error);
        logger.error('Exception occurred while adding subscription: ', error);
        subscriptionAdd_resp.status = 500;
        subscriptionAdd_resp.data = 'Internal Server error!';
        res.send(subscriptionAdd_resp);
    }

}

exports.subscriptionPay = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let subscriptionPay_resp = {};
            subscriptionPay_resp.status = 422;
            subscriptionPay_resp.data = errors;
            // res.status(422);
            res.send(subscriptionPay_resp);
        }
        else {
            let subscriptionPay_resp = {};
            let inputData = req.body;

            console.log("inputData", inputData)

            sucscriptionModel.findById({ _id: inputData.userId }, function (err, result) {
                if (err) {
                    subscriptionPay_resp.status = 422;
                    subscriptionPay_resp.data = 'Error occurred while getting subscription!!';
                    res.send(subscriptionPay_resp);
                }
                else {

                    fs.readFile(subscriptionPlansJson, (err, data) => {
                        if (err) {
                            subscriptionPay_resp.status = 'error';
                            subscriptionPay_resp.data = null;
                            subscriptionPay_resp.message = 'Internal Server error! ';
                            res.send(subscriptionPay_resp);
                        } else {
                            let subscriptionPayContent = JSON.parse(data);

                            payuMoneyService.generatePaymentURLForSubScription(req.body, function (result) {
                                if (result['status'] == 'SUCCESS') {
                                    subscriptionPay_resp.status = 'SUCCESS';
                                    subscriptionPay_resp.data = result['data'];
                                    res.send(subscriptionPay_resp);
                                }
                                else {
                                    subscriptionPay_resp.status = 'ERROR';
                                    subscriptionPay_resp.data = result['data'];
                                    res.send(subscriptionPay_resp);
                                }
                            })
                        }
                    });
                }
            });
        }
    } catch (error) {
        let subscriptionPay_resp = {};
        console.log('create subscription=', error);
        logger.error('Exception occurred while adding subscription: ', error);
        subscriptionPay_resp.status = 500;
        subscriptionPay_resp.data = 'Internal Server error!';
        res.send(subscriptionPay_resp);
    }

}

exports.subscriptionrechargesuccess = function (req, res, next) {
    try {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body)) {
            console.log('Request Body =', req.body)

            if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body.payuMoneyId) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.productinfo) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.txnid) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.amount) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.email) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.phone) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.txnid) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.status) &&
                !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.firstname)) {

                let seller_Id = req.body.productinfo.split("_")[1];
                let plan = req.body.productinfo.split("_")[2];
                let txnid = req.body.txnid;
                let amount = req.body.amount;

                sucscriptionModel.findById({ _id: seller_Id }, function (err, result) {
                    if (!err) {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                            result.prevAmount = result.amount;
                            if (plan == 'plan1') {
                                result.subscription_expire_date = result.subscription_expire_date != null ? moment.tz(result.subscription_expire_date, "DD-MM-YYYY", "Asia/Kolkata").add(30, 'days').format('DD-MM-YYYY') : moment.tz("Asia/Kolkata").add(30, 'days').format('DD-MM-YYYY');
                                result.noOfMonths = 1;
                                result.noOfDays = 30;
                                result.plan = plan;
                            } else if (plan == 'plan2') {
                                result.subscription_expire_date = result.subscription_expire_date != null ? moment.tz(result.subscription_expire_date, "DD-MM-YYYY", "Asia/Kolkata").add(30, 'days').format('DD-MM-YYYY') : moment.tz("Asia/Kolkata").add(60, 'days').format('DD-MM-YYYY');
                                result.noOfMonths = 2;
                                result.noOfDays = 60;
                                result.plan = plan;
                            } else if (plan == 'plan3') {
                                result.subscription_expire_date = result.subscription_expire_date != null ? moment.tz(result.subscription_expire_date, "DD-MM-YYYY", "Asia/Kolkata").add(30, 'days').format('DD-MM-YYYY') : moment.tz("Asia/Kolkata").add(90, 'days').format('DD-MM-YYYY');
                                result.noOfMonths = 3;
                                result.noOfDays = 90;
                                result.plan = plan;
                            }
                            result.subscription_added_date = moment.tz("Asia/Kolkata").format('DD-MM-YYYY');
                            result.subscription_added_time = moment().tz('Asia/Kolkata').format('H:mm:ss');
                            result.subscription_expire_time = moment().tz('Asia/Kolkata').format('H:mm:ss');

                            result.gst_percentage = 18;
                            result.amount = amount;
                            result.totalAmount = amount;
                            result.lastTxn = txnid;
                            result.history.push(req.body);
                            result.save();
                        }
                        else {
                            prodDoc = new sucscriptionModel();
                            console.log('seller_Id', seller_Id);
                            prodDoc._id = seller_Id;
                            prodDoc.history.push(req.body);

                            if (plan == 'plan1') {
                                prodDoc.subscription_expire_date = moment.tz("Asia/Kolkata").add(30, 'days').format('DD-MM-YYYY');
                                prodDoc.noOfMonths = 1;
                                prodDoc.noOfDays = 30;
                                prodDoc.plan = plan;
                            } else if (plan == 'plan2') {
                                prodDoc.subscription_expire_date = moment.tz("Asia/Kolkata").add(60, 'days').format('DD-MM-YYYY');
                                prodDoc.noOfMonths = 2;
                                prodDoc.noOfDays = 60;
                                prodDoc.plan = plan;
                            } else if (plan == 'plan3') {
                                prodDoc.subscription_expire_date = moment.tz("Asia/Kolkata").add(90, 'days').format('DD-MM-YYYY');
                                prodDoc.noOfMonths = 3;
                                prodDoc.noOfDays = 90;
                                prodDoc.plan = plan;
                            }
                            prodDoc.subscription_added_date = moment.tz("Asia/Kolkata").format('DD-MM-YYYY');
                            prodDoc.subscription_added_time = moment().tz('Asia/Kolkata').format('H:mm:ss');
                            prodDoc.subscription_expire_time = moment().tz('Asia/Kolkata').format('H:mm:ss');

                            prodDoc.gst_percentage = 18;
                            prodDoc.amount = amount;
                            prodDoc.totalAmount = amount;
                            prodDoc.lastTxn = txnid;

                            prodDoc.save();
                        }
                    }
                });
                res.writeHead(301,
                    { Location: webClient + 'layout/payment-success' }
                );
                res.end();
            } else {
                res.writeHead(301,
                    { Location: webClient + 'layout/payment-failed' }
                );
                res.end();
            }


        } else {
            res.writeHead(301,
                { Location: webClient + 'layout/payment-failed' }
            );
            res.end();
        }
    } catch (error) {
        console.log('csubscriptionrechargesuccess=', error);
        logger.error('Exception occurred while adding subscription: ', error);
        res.writeHead(301,
            { Location: webClient + 'layout/payment-failed' }
        );
        res.end();
    }

};

exports.subscriptionrechargefailure = function (req, res, next) {
    try {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body)) {
            let seller_Id = req.body.productinfo.split("_")[1];

            sucscriptionModel.findById({ _id: seller_Id }, function (err, result) {
                if (!err) {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        result.history.push(req.body);
                        result.save();
                    }
                    else {
                        prodDoc = new sucscriptionModel();
                        console.log('seller_Id', seller_Id);
                        prodDoc._id = seller_Id;
                        prodDoc.history.push(req.body);
                        prodDoc.save();
                    }
                }
            });

            res.writeHead(301,
                { Location: webClient + 'layout/payment-failed' }
            );
            res.end();
        } else {
            res.writeHead(301,
                { Location: webClient + 'layout/payment-failed' }
            );
            res.end();
        }
    } catch (error) {
        console.log('subscriptionrechargefailure=', error);
        res.writeHead(301,
            { Location: webClient + 'layout/payment-failed' }
        );
        res.end();
    }

};