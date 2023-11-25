var path = require('path');
var razorPay = require(path.join(__dirname, '..', '..', 'controllers', 'razorpay', 'razorPayMasterCtrl'));

module.exports = function(app) {
app.post("/api/v1/website/orderpaymentthroughrazorpay", razorPay.makeOrderPayment);
app.post("/api/v1/website/successPaymentthroughrazorpay", razorPay.successPayment);
app.post("/api/v1/website/failedPaymentthroughrazorpay", razorPay.failedPayment);

app.post("/api/v1/website/verifypaymentthroughrazorpay", razorPay.verifyPayment);
}