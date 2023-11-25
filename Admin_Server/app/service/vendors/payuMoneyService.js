var path = require('path');
var dateFormat = require('dateformat');
var payumoney = require('payumoney-node');
var check = require(path.join(__dirname, '..', 'util', 'checkValidObject'));
var payumoneyConfig = require(path.join(__dirname, '..', '..', 'global', 'payumoney', 'payumoneyConfig'));

exports.generatePaymentURLForSubScription = function (req, callback) {
  console.log('Req=', req);
  try {
    let generatePaymentURL_Resp = {};
    let date_now_time = dateFormat(new Date(), "yyyymmddhMMss");
    let native_trx_id = req.email.split('@')[0] + date_now_time;

    let paymentData = {
      txnid: native_trx_id,
      amount: req.planDetails.plan == 'plan1' ? 236 : req.planDetails.plan == 'plan2' ? 472 : req.planDetails.plan == 'plan3' ? 708 : 708,
      productinfo: 'SUBSCRIPTION' + "_" + req.userId + "_" + req.planDetails.plan,
      firstname: req.firstname,
      lastname: req.lastname,
      email: req.email,
      phone: req.phone,
      surl: req.surl,
      furl: req.furl
    }
    payumoney.setKeys(payumoneyConfig.MERCHANT_KEY, payumoneyConfig.MERCHANT_SALT, payumoneyConfig.AUTHORIZATION_HEADER);
    payumoney.isProdMode(true);
    console.log('paymentData=', paymentData);
    payumoney.makePayment(paymentData, function (error, response) {
      if (error) {
        generatePaymentURL_Resp.status = 'ERROR';
        generatePaymentURL_Resp.data = 'Error while sending paymentURL generation request';
        callback(generatePaymentURL_Resp);

      } else {
        // Payment redirection link
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(response)) {
          generatePaymentURL_Resp.status = 'SUCCESS';
          generatePaymentURL_Resp.data = response;
          callback(generatePaymentURL_Resp);
        }
        else {
          generatePaymentURL_Resp.status = 'ERROR';
          generatePaymentURL_Resp.data = 'Payment Can not be Processed by our partner PayuMoney right Now, Please Contact mybrand Support for Offline Payment';
          callback(generatePaymentURL_Resp);
        }
      }
    });
  } catch (error) {
    console.log('Error in PayuServie', error);
    let generatePaymentURL_Resp = {};
    generatePaymentURL_Resp.status = 'ERROR';
    generatePaymentURL_Resp.data = 'Error while sending  paymentURL generation request';
    callback(generatePaymentURL_Resp);
  }
}
