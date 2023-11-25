var path = require('path');
var razorpayBasic = require(path.join(__dirname, 'admin', 'razorPayBasicCtrl'));

exports.makeOrderPayment = razorpayBasic.makeOrderPayment;
exports.successPayment = razorpayBasic.successPayment;
exports.failedPayment = razorpayBasic.failedPayment;
exports.verifyPayment = razorpayBasic.verifyPayment;