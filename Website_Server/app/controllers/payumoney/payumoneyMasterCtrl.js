var path = require('path');
var payumoneyBasic = require(path.join(__dirname, 'admin', 'payumoneyBasicCtrl'));

exports.makeOrderPayment = payumoneyBasic.makeOrderPayment;
exports.successPayment = payumoneyBasic.successPayment;
exports.failedPayment = payumoneyBasic.failedPayment;