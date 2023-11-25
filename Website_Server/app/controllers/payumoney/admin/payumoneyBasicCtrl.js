
const { validationResult } = require('express-validator');
var path = require('path');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
var payumoney = require('payumoney-node');
var logger = require('logger').createLogger();
var orderModel = require('mongoose').model('orderModel');
var paymentKeysModel =  require('mongoose').model('paymentKeysModel');
var requestData = require('request');
var crypto = require('crypto');
const { Logger } = require('logger');


exports.makeOrderPayment = function (req, res) {
    try {
        console.log(' req.body;', req.body);
        let makeOrderPayment_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            makeOrderPayment_resp.status = 400;
            makeOrderPayment_resp.data = errors;
            res.status(400);
            res.send(makeOrderPayment_resp);
        }
        else {
            var body_data = req.body;
            var txnid = body_data.trxNo;
            var orderID = body_data.orderID;
            var amount = body_data.amount;
            var email = body_data.email;
            var phone = body_data.phone;
            var lastname = body_data.lastname;
            var firstname = body_data.firstname;
            var storeDomain = body_data.storeDomain;
            var sellerId = body_data.udf1;
            var customerId = body_data.customerID;
            var productinfo = sellerId + "_" + customerId + "_" +  storeDomain;
            var udf5 = "";

            //To do  Collect sellerID,customerID,orderID and txnid = orderID, productinfo=> sellerId | customerID and use them in successpayment
            let url = "https://secure.payu.in/_payment";
            paymentKeysModel.findById({ _id: body_data.udf1 }, function (err, result) {
                if (err || check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    makeOrderPayment_resp.status = 500;
                    makeOrderPayment_resp.data = 'Contact Seller for making payment';
                    res.status(500);
                    res.send(makeOrderPayment_resp);
                }
                else {
                    var cryp = crypto.createHash('sha512');
                    var text = result["payUMerchantKey"] + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||' + udf5 + '||||||' + result["payUMerchantSalt"];
                    cryp.update(text);
                    var hash = cryp.digest('hex');
                    var payuData = {
                        key: result["payUMerchantKey"],
                        salt: result["payUMerchantSalt"],
                        hash: hash
                    };
                    let paymentData = {
                        "key": result["payUMerchantKey"],
                        "txnid": txnid,
                        "amount": amount,
                        "productinfo": productinfo,
                        "email": email,
                        "phone": phone,
                        "lastname": lastname,
                        "firstname": firstname,
                        "udf5": udf5,
                        //Production
                        // surl: "https://api.dynamicexecution.com/api/v1/website/successPayment",
                        // furl: "https://api.dynamicexecution.com/api/v1/website/failedPayment",
                        surl: "https://webapi.dynamicexecution.com/api/v1/website/successPayment",
                        furl: "https://webapi.dynamicexecution.com/api/v1/website/failedPayment",
                        "hash": hash
                        //Developement
                        // surl: "http://localhost:7005/api/v1/website/successPayment",
                        // furl: "http://localhost:7005/api/v1/website/failedPayment"
                    };
                    var params = Object.assign(payuData, paymentData);
                    console.log('params', params);
                    requestData.post(url, { form: params, headers: { 'Content-Type': 'application:x-www-form-urlencoded' } },
                        function (error, response, body) {
                            if (!error) {
                                console.log('Body=', body);
                                var result = response.headers.location;
                                makeOrderPayment_resp.status = 200;
                                makeOrderPayment_resp.data = result;
                                res.send(makeOrderPayment_resp);
                            }
                            else {
                                logger.error('Error occurred while Making the Payment', error);
                                makeOrderPayment_resp.status = 500;
                                makeOrderPayment_resp.data = 'Please contact Seller for payment';
                                res.status(500);
                                res.send(makeOrderPayment_resp);
                            }
                        });
                }
            });
        }
    } catch (error) {
        let makeOrderPayment_resp = {};
        logger.error('makeOrderPayment:: Error while fetching make payment process', error);
        makeOrderPayment_resp.status = 500;
        makeOrderPayment_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(makeOrderPayment_resp);
    }
}

exports.successPayment = function (req, res) {
    let successPayment_resp = {};
    try {
        let seller_id = req.body["productinfo"].split("_")[0];
        // let customerId = req.body["productinfo"].split(";")[1];
        let customerId = req.body["productinfo"].split("_")[1];
        let domainName = "https://" + req.body["productinfo"].split("_")[2] + '/success.php';
        console.log('IDS', seller_id, customerId, domainName);
        let orderId = req.body["txnid"];
        logger.info('successPayment::', req.body );
        let paymentInfo =
        {
            vendorName: 'PAYUMONEY',
            mihpayid: req.body["mihpayid"],
            status: req.body["status"],
            txnid: req.body["bank_ref_num"],
            amount: req.body["amount"],
            addedon: req.body["addedon"],
            bankcode: req.body["bankcode"],
            payuMoneyId: req.body["payuMoneyId"],
            net_amount_debit: req.body["net_amount_debit"]
        };
        orderModel.findOne({ _id: seller_id },
            function (err, result) {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    // console.log('result', result["customers"][0]["orders"]);
                    result["customers"].forEach(customer => {
                        if(customer["customerId"] == customerId){
                            customer["orders"].forEach(order=>{
                                if(order["_id"] == orderId){
                                    order.paymentDetails["paymentInfo"] = paymentInfo;
                                    order.paymentDetails.paymendStatus = 'COMPLETED';
                                    order.paymentDetails.payment_date = Date.now();
                                    result.save(function(err, savedOrderObj){
                                        if (err) {
                                            successPayment_resp.status = 'failed';
                                            successPayment_resp.data = 'Failed to update payment information';
                                            res.status(500);
                                            res.send(successPayment_resp);
                                        }
                                        else {
                                            successPayment_resp.status = 'SUCCESS';
                                            successPayment_resp.data = 'Successfully updated payment information';
                                            res.status(200);
                                            res.redirect(domainName, function (err, result) {
                                                console.log('res 165', result);
                                            });
                                            // res.send(successPayment_resp);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
                else {
                    successPayment_resp.status = 'failed ';
                    successPayment_resp.data = 'Not able to track the order';
                    res.status(500);
                    res.send(successPayment_resp);
                }
            });

    } catch (error) {
        logger.error("successPayment :: Error Occurred while Making the payment" , error );
        successPayment_resp.status = 'failed ';
        successPayment_resp.data = 'Not able to track the order';
        res.status(500);
        res.send(successPayment_resp);
    }
}

exports.failedPayment = function (req, res) {
    try {
        let failedPayment_resp = {};
        console.log(req.body);
        failedPayment_resp.status = 500;
        res.status(500);
        res.send(failedPayment_resp)
    } catch (error) {
        let failedPayment_resp = {};
        console.log(req.body);
        failedPayment_resp.status = 500;
        res.status(500);
        res.send(failedPayment_resp)
    }
}