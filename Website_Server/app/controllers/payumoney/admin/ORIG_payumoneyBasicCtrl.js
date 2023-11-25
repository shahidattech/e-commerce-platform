
const { validationResult } = require('express-validator');
var path = require('path');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
var payumoney = require('payumoney-node');
var logger = require('logger').createLogger();
var orderModel = require('mongoose').model('orderModel');
var paymentKeysModel =  require('mongoose').model('paymentKeysModel');


exports.makeOrderPayment = function (req, res) {
    try {
        console.log(' req.body;',  req.body);
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
            var trxNo = body_data.trxNo;
            var orderID = body_data.orderID;
            var amount = body_data.amount;
            var email = body_data.email;
            var phone = body_data.phone;
            var lastname = body_data.lastname;
            var firstname = body_data.firstname;
            var storeDomain = body_data.storeDomain;
            var sellerId = body_data.udf1;
            var customerId = body_data.customerID;
            //To do  Collect sellerID,customerID,orderID and txnid = orderID, productinfo=> sellerId | customerID and use them in successpayment
            const paymentData = {
                productinfo: sellerId + "_" + customerId + "_" +  storeDomain,
                txnid: trxNo,
                amount: amount,
                email: email,
                phone: phone,
                lastname: lastname,
                firstname: firstname,
                // udf1: "604a7601b2bab3180fd231a1",//SellerID
                // udf2: "3335",//Customer ID
                // udf3: "604a83585e1a1b1d201e70d2", //Order ID
                //Production
                surl: "https://api.bhbazar.com/storeapi/storeordersuccess",
                furl: "https://api.bhbazar.com/storeapi/storeorderfailure",
                //Developement
                // surl: "http://localhost:7005/api/v1/website/successPayment",
                // furl: "http://localhost:7005/api/v1/website/failedPayment"
            };
            paymentKeysModel.findById({ _id: req.body["udf1"] },function(err, result) {
            paymentKeysModel.findById({ _id: req.body["udf1"] },function(err, result) {
                if(err){
                    makeOrderPayment_resp.data = 'Contact Seller for making payment';
                    res.status(500);
                    res.send(makeOrderPayment_resp);                    
                }
                else{
                    console.log('result=', result);
                    const payuConfig = {
                        MERCHANT_KEY: result["payUMerchantKey"],
                        MERCHANT_SALT: result["payUMerchantSalt"],
                        AUTHORIZATION_HEADER: result["payUMerchantHeader"]
                    };
                    payumoney.isProdMode(true);
                    if (payuConfig.MERCHANT_KEY === undefined || payuConfig.MERCHANT_KEY === null || payuConfig.MERCHANT_SALT === undefined || payuConfig.MERCHANT_SALT === null || payuConfig.AUTHORIZATION_HEADER === undefined || payuConfig.AUTHORIZATION_HEADER === null) {
                        bankData.NO_BANK_DTL_FOUND = 4;
                        next();
                    }
                    payumoney.setKeys(payuConfig.MERCHANT_KEY, payuConfig.MERCHANT_SALT, payuConfig.AUTHORIZATION_HEADER);
                    console.log('sellerBank', payuConfig.MERCHANT_KEY, payuConfig.MERCHANT_SALT, payuConfig.AUTHORIZATION_HEADER);
                    payumoney.makePayment(paymentData, function (error, data) {
                        if (error) {
                            // Some error
                            console.log('Error', error);
                            // result.errorcodes = errorcodes.PAY_ERROR;
                            logger.error('makeOrderPayment:: payumoney process error', error);
                            makeOrderPayment_resp.status = 500;
                            makeOrderPayment_resp.data = 'Internal Server Error';
                            res.status(500);
                            res.send(makeOrderPayment_resp);
                        } else {
                            // Payment redirection link
                            if(!check.isUndefinedOrNullOrEmptyOrNoLen(data)){
                                console.log('Payment redirection link', data);
                                makeOrderPayment_resp.status = 200;
                                makeOrderPayment_resp.data = data;
                                res.status(200);
                                res.send(makeOrderPayment_resp);
                            }
                            else{
                                console.log('Payment redirection link', data);
                                makeOrderPayment_resp.status = 500;
                                makeOrderPayment_resp.data = 'Issue with seller BANK';
                                res.status(500);
                                res.send(makeOrderPayment_resp);
                            }

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

exports.successPayment = function(req, res) {
    let successPayment_resp = {};
    try {
        let seller_id = req.body["productinfo"].split("_")[0];
        // let customerId = req.body["productinfo"].split(";")[1];
        let customerId = req.body["productinfo"].split("_")[1];
        let domainName = "https://" + req.body["productinfo"].split("_")[2] + '/success.php';
        console.log('IDS', seller_id,customerId, domainName);
        let orderId = req.body["txnid"];
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
        orderModel.findOne({_id: seller_id, 'customers.customerId': customerId},  
        function(err, result){
            if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                // console.log('result', result["customers"][0]["orders"]);
                result["customers"][0]["orders"].forEach(order => {
                    if(order["_id"] == orderId && req.body["status"] == 'success'){
                        order.paymentDetails["paymentInfo"] = paymentInfo;
                        order.paymentDetails.paymendStatus = 'COMPLETED';
                        order.paymentDetails.payment_date = Date.now();
                        order.save();
                        result.save(function(err, result){
                            if(err){
                                successPayment_resp.status = 'failed';
                                successPayment_resp.data = 'Failed to update payment information';
                                res.status(500);
                                res.send(successPayment_resp);
                            }
                            else{
                                successPayment_resp.status = 'SUCCESS';
                                successPayment_resp.data = 'Successfully updated payment information';
                                res.status(200);
                                res.redirect(domainName, function(err, result){
                                    console.log('res 165', result);
                                });
                                // res.send(successPayment_resp);
                            }
                        });
                    }
                });
            }
            else{
                successPayment_resp.status = 'failed ';
                successPayment_resp.data = 'Not able to track the order';
                res.status(500);
                res.send(successPayment_resp);
            }
        });
        
    } catch (error) {
        successPayment_resp.status = 'failed ';
        successPayment_resp.data = 'Not able to track the order';
        res.status(500);
        res.send(successPayment_resp);
    }
}

exports.failedPayment = function(req, res){
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