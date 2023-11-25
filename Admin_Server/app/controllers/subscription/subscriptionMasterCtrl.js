var path = require('path');
var subscriptionBasic = require(path.join(__dirname, 'admin', 'subscriptionBasicCtrl'));

exports.checkSubscription = subscriptionBasic.checkSubscription;
exports.getSubscriptionContent = subscriptionBasic.getSubscriptionContent;
exports.subscriptionAdd = subscriptionBasic.subscriptionAdd;
exports.subscriptionPay = subscriptionBasic.subscriptionPay;
exports.subscriptionrechargesuccess = subscriptionBasic.subscriptionrechargesuccess;
exports.subscriptionrechargefailure = subscriptionBasic.subscriptionrechargefailure;