
const { validationResult } = require('express-validator');
var path = require('path');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
var Razorpay = require('razorpay');
var logger = require('logger').createLogger();
var orderModel = require('mongoose').model('orderModel');
var paymentKeysModel = require('mongoose').model('paymentKeysModel');


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
            let amount = body_data.amount;
            let currency = "INR";
            let receipt = body_data.orderID;
            let payment_capture = false;
            let notes = {
                "email": body_data.email,
                "phone": body_data.phone,
                "lastname": body_data.lastname,
                "firstname": body_data.firstname,
                "storeDomain": body_data.storeDomain,
                "sellerId": body_data.udf1,
                "customerId": body_data.customerID,
                "receipt": receipt // this is mongoOrderId
            };
            let key_id = 'rzp_test_RqiXg8fSfzZnAd';
            let key_secret = 'tP25cIM5i6iqIzxd5BL733FQ';
            
            let instance = new Razorpay({ key_id, key_secret });

            amount = amount * 100;
            instance.orders.create({ amount, currency, receipt, payment_capture, notes },
                function (err, data) {
                    if (err) {
                        console.log('Error', err)
                        makeOrderPayment_resp.data = 'Contact Seller for making payment';
                        res.status(500);
                        res.send(makeOrderPayment_resp);
                    }
                    else {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(data)) {
                            console.log('Payment redirection link', data);
                            makeOrderPayment_resp.status = 200;
                            data.key_id = key_id;
                            makeOrderPayment_resp.data = data;
                            res.status(200);
                            res.send(makeOrderPayment_resp);
                        }
                        else {
                            console.log('Payment redirection link', data);
                            makeOrderPayment_resp.status = 500;
                            makeOrderPayment_resp.data = 'Issue with seller BANK';
                            res.status(500);
                            res.send(makeOrderPayment_resp);
                        }
                    }
                })
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
        orderModel.findOne({ _id: seller_id, 'customers.customerId': customerId },
            function (err, result) {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    // console.log('result', result["customers"][0]["orders"]);
                    result["customers"][0]["orders"].forEach(order => {
                        if (order["_id"] == orderId && req.body["status"] == 'success') {
                            order.paymentDetails["paymentInfo"] = paymentInfo;
                            order.paymentDetails.paymendStatus = 'COMPLETED';
                            order.paymentDetails.payment_date = Date.now();
                            order.save();
                            result.save(function (err, result) {
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

exports.verifyPayment = function (req, res) {
    let successPayment_resp = {};
    try {
        let seller_id = req.body["seller_id"];
        // let order_id = req.body["razorpay_order_id"];
        // let signaturepayment_id = req.body["razorpay_signature"];
        let payment_id = req.body["razorpay_payment_id"];

        let key_id = 'rzp_test_RqiXg8fSfzZnAd';
        let key_secret = 'tP25cIM5i6iqIzxd5BL733FQ';

        let instance = new Razorpay({ key_id, key_secret });

        instance.payments.fetch(payment_id).then((response) => {
            console.log(response);
            // handle success
            let paymentInfo =
            {
                vendorName: 'RAZORPAY',
                // razorpay_order_id: response.order_id,
                // razorpay_payment_id: response.id,
                // razorpay_signature: signaturepayment_id,
                mihpayid: response.order_id,
                status: 'success',
                txnid: response.id,
                addedon: response.created_at,
                amount: response.amount / 100,
                net_amount_debit: response.amount / 100
            };

            let seller_id = response.notes.sellerId;
            let customerId = response.notes.customerId;
            let mongoOrderID = response.notes.receipt;
            console.log(mongoOrderID);
            
            orderModel.findOne({ _id: seller_id, 'customers.customerId': customerId },
            function (err, result) {
                console.log(result);
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    // console.log('result', result["customers"][0]["orders"]);
                    result["customers"].forEach(rr => {
                        console.log("orders", rr);
                        if (rr.customerId == customerId) {
                            rr.orders.forEach(order => {
                                console.log("zzzz", order["_id"]);
                                if (order["_id"] == mongoOrderID) {
                                    console.log("aaaaa");
                                    order.paymentDetails["paymentInfo"] = paymentInfo;
                                    order.paymentDetails.paymendStatus = 'COMPLETED';
                                    order.paymentDetails.payment_date = Date.now();
                                    order.save();
                                    result.save(function (err, result) {
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
                                            res.send(successPayment_resp);
                                        }
                                    });
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

          }).catch((error) => {
              console.log(error);
            // handle error
            successPayment_resp.status = 'failed ';
            successPayment_resp.data = error.description;
            res.status(500);
            res.send(successPayment_resp);
          });

    } catch (error) {
        successPayment_resp.status = 'failed ';
        successPayment_resp.data = 'Not able to track the order';
        res.status(500);
        res.send(successPayment_resp);
    }
}