var path = require('path');
var subscriptionCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'subscription', 'subscriptionMasterCtrl'));
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
var featureChecker = require(path.join(__dirname, '..', '..', 'service', 'auth', 'featureChecker'));
const { check } = require('express-validator');

module.exports = function (app, upload) {
    var default_url_path = '/api/v1/subscription/';
    //   app.get(default_url_path + 'check', 
    //     jwt.validateToken,
    //     featureChecker.hasAccessToFeatureNew,
    //     [check('userId').isLength({ min: 5 }).withMessage('Please Enter userId')],
    //     subscriptionCtrl.createProduct);
    app.get(default_url_path + 'check', subscriptionCtrl.checkSubscription);

    app.get(default_url_path + "check/:userId", subscriptionCtrl.checkSubscription);

    app.post(default_url_path + 'getSubscriptionContent',
        jwt.validateToken,
        featureChecker.hasAccessToFeatureNew,
        [check('userId').isLength({ min: 5 }).withMessage('Please Enter userId')],
        subscriptionCtrl.getSubscriptionContent);

    app.post(default_url_path + 'add',
        jwt.validateToken,
        featureChecker.hasAccessToFeatureNew,
        subscriptionCtrl.subscriptionAdd);

    app.post(default_url_path + 'pay',
        jwt.validateToken,
        featureChecker.hasAccessToFeatureNew,
        subscriptionCtrl.subscriptionPay);

    app.post(default_url_path + 'subscriptionrechargesuccess',
        subscriptionCtrl.subscriptionrechargesuccess);

    app.post(default_url_path + 'subscriptionrechargefailure',
        subscriptionCtrl.subscriptionrechargefailure);
};

