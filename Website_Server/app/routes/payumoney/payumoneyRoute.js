var path = require('path');
var payUmoney = require(path.join(__dirname, '..', '..', 'controllers', 'payumoney', 'payumoneyMasterCtrl'));

module.exports = function(app) {
app.post("/api/v1/website/orderpayment", payUmoney.makeOrderPayment);
app.post("/api/v1/website/successPayment", payUmoney.successPayment);
app.post("/api/v1/website/failedPayment", payUmoney.failedPayment);

}