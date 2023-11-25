var restify = require('restify');
var logger = require('logger').createLogger();
const { validationResult } = require('express-validator');
var path = require('path');
const fs = require('fs');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
const { Mongoose } = require('mongoose');
const MUUID = require('uuid-mongodb');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');
var orderModel = require('mongoose').model('orderModel');
var productModel = require('mongoose').model('Product');
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var statisticsModel = require('mongoose').model('statisticsModel');
var emailService = require(path.join(__dirname, '..', '..', '..', 'service', 'email', 'emailService'));


exports.placeAnOrder = function (req, res) {
    try {
        let placeOrder_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            placeOrder_resp.status = 422;
            placeOrder_resp.data = 'Invalid Input';
            res.status(422);
            res.send(placeOrder_resp);
        }
        else{
            let formattedOrderData = formatOrderData(req.body["customers"]);
            let notiFicationdata = {};
            homeConfigTheme1Model.findById({_id: req.body["userId"]}, function(err, result){
                if(err){
                    placeOrder_resp.status = 500;
                    placeOrder_resp.data = 'Error while finding the user from User Account for Notification';
                    res.status(500);
                    res.send(placeOrder_resp);
                }
                else{
                    let timeNow = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(result) && !check.isUndefinedOrNullOrEmptyOrNoLen(result["storeGeneralInfo"].email)){
                        let recipients = [];
                        recipients.push({'address': formattedOrderData["customers"]["orders"][0].shippingDetails.email});
                        recipients.push( {'address': result["storeGeneralInfo"].email} );
                        notiFicationdata.from = result["storeGeneralInfo"].email;
                        notiFicationdata.recipients = recipients;
                        notiFicationdata.subject = "New Order Placed at " + timeNow;
                        notiFicationdata.orderTemplate = result["storeGeneralInfo"].orderTemplate;
                    }
                    else{
                        let recipients = [];
                        recipients.push( {'address': formattedOrderData["customers"]["orders"][0].shippingDetails.email });
                        recipients.push({'address': 'contact@myglobalbazar.com'});
                        notiFicationdata.from = 'contact@myglobalbazar.com';
                        notiFicationdata.recipients = recipients;
                        notiFicationdata.subject = "New Order Placed at " + timeNow;
                        notiFicationdata.orderTemplate = 'commonnotification_order.html';
                    }
                    orderModel.findById({ _id: req.body["userId"] }, function(err, userObj){
                        if(err){
                            placeOrder_resp.status = 500;
                            placeOrder_resp.data = 'Error while finding the user';
                            res.status(500);
                            res.send(placeOrder_resp);
                        }
                        else{
                            if(!check.isUndefinedOrNullOrEmptyOrNoLen(userObj)){
                                orderModel.findOneAndUpdate({_id:  req.body["userId"], "customers.customerId" : formattedOrderData["customers"].customerId},
                                {$push: {"customers.$.orders": formattedOrderData["customers"].orders }},
                                function(err, result){
                                    if(err){
                                        placeOrder_resp.status = 500;
                                        placeOrder_resp.data = 'Error while Pushing the Order !';
                                        res.status(500);
                                        res.send(placeOrder_resp);
                                    }
                                    else{
                                        if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                                            placeOrder_resp.status = 200;
                                            orderModel.findOne({ _id: req.body["userId"], "customers.customerId" : formattedOrderData["customers"].customerId},
                                            function(err, latestOrder){
                                                if(err){
                                                    console.log('42', err);
                                                    placeOrder_resp.status = 500;
                                                    placeOrder_resp.data = 'Error while fetching the latest order for this store and for this customer !';
                                                    res.status(500);
                                                    res.send(placeOrder_resp);
                                                }
                                                else{
                                                    latestOrder["customers"].forEach(custOrder => {
                                                        if(custOrder["customerId"] == formattedOrderData["customers"].customerId){
                                                            res.status(200);
                                                            placeOrder_resp.data = custOrder["orders"].pop()._id;
                                                            emailService.sendEmail(notiFicationdata, function(result){
                                                                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                                                                    placeOrder_resp.notiFication = 'Email Notification Has been sent';
                                                                    console.log('reduceStock', 'reduceStock');
                                                                    reduceStock( req.body["userId"] ,formattedOrderData, function(result){
                                                                        if(result){
                                                                            writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                res.send(placeOrder_resp);
                                                                            });
                                                                        }
                                                                        else{
                                                                            writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                res.send(placeOrder_resp);
                                                                            });
                                                                        }
                                                                    });
                                                                    
                                                                }
                                                                else{
                                                                    reduceStock(req.body["userId"], formattedOrderData, function(result){
                                                                        if(result){
                                                                            writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                res.send(placeOrder_resp);
                                                                            });
                                                                        }
                                                                        else{
                                                                            writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                res.send(placeOrder_resp);
                                                                            });
                                                                        }
                                                                    });
                                                                }
        
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else{
                                            userObj.customers.push(formattedOrderData["customers"]);
                                            userObj.save(function(err, userObj){
                                                if(err){
                                                    placeOrder_resp.status = 500;
                                                    placeOrder_resp.data = 'Failed to add first order for your Store !';
                                                    res.status(500);
                                                    res.send(placeOrder_resp);
                                                }
                                                else{
                                                    orderModel.findOne({ _id: req.body["userId"],"customers.customerId" : formattedOrderData["customers"].customerId},
                                                    function(err, result){
                                                        if(err){
                                                            console.log('Err 120', err);
                                                            placeOrder_resp.status = 500;
                                                            res.send(placeOrder_resp);
                                                        }
                                                        else{
                                                            placeOrder_resp.status = 200;
                                                            result["customers"].forEach(customer=>{
                                                                if(customer["customerId"] == formattedOrderData["customers"].customerId ){
                                                                    placeOrder_resp.data = customer["orders"].pop()._id;
                                                                    emailService.sendEmail(notiFicationdata, function(result){
                                                                        if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                                                                            placeOrder_resp.status = 200;
                                                                            placeOrder_resp.notiFication = 'Email notification HAs been sent';
                                                                            reduceStock(req.body["userId"], formattedOrderData, function(result){
                                                                                if(result){
                                                                                    writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                        res.send(placeOrder_resp);
                                                                                    });
                                                                                }
                                                                                else{
                                                                                    writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                        res.send(placeOrder_resp);
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                        else{
                                                                            placeOrder_resp.status = 200;
                                                                            placeOrder_resp.notiFication = 'Email notification has not been sent';
                                                                            reduceStock(req.body["userId"], formattedOrderData, function(result){
                                                                                if(result){
                                                                                    writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                        res.send(placeOrder_resp);
                                                                                    });
                                                                                }
                                                                                else{
                                                                                    writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                                        res.send(placeOrder_resp);
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                let orderObj = new orderModel({_id: req.body["userId"]});
                                orderObj.customers.push(formattedOrderData["customers"])
                                orderObj.save(function(err, result){
                                    if(err){
                                        placeOrder_resp.status = 500;
                                        console.log('Error 132', err);
                                        placeOrder_resp.data = 'Failed to place the very first Order !';
                                        res.status(500);
                                        res.send(placeOrder_resp);  
                                    }
                                    else{
                                        console.log('Placing the very first Order 152', result);
                                        orderModel.findById({_id: req.body["userId"]}, function(err, result) {
                                            if(err){
                                                console.log('Err 155', err);
                                                placeOrder_resp.status = 200;
                                                res.status = 500;
                                                res.data = 'Failed to fetch the very first Order';
                                                res.send(placeOrder_resp);
                                            }
                                            else{
                                                placeOrder_resp.status = 200;
                                                placeOrder_resp.data = result["customers"][0]["orders"].pop()._id;
                                                placeOrder_resp.status = 200;
                                                res.status(200);
                                                emailService.sendEmail(notiFicationdata, function(emailSendingStatus){
                                                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(emailSendingStatus)){
                                                        // placeOrder_resp.data = 'Successfully Appended the order to your Bucket !';
                                                        console.log('placeOrder_resp', placeOrder_resp);
                                                        placeOrder_resp.notiFication = 'Email notification has been sent';
                                                        reduceStock(req.body["userId"], formatOrderData, function(result){
                                                            if(result){
                                                                writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                    res.send(placeOrder_resp);
                                                                });
                                                            }
                                                            else{
                                                                writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                    res.send(placeOrder_resp);
                                                                });
                                                            }
                                                        });
                                                    }
                                                    else{
                                                        console.log('157 placeOrder_resp', placeOrder_resp);
                                                        reduceStock(req.body["userId"], formatOrderData, function(result){
                                                            if(result){
                                                                writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                    res.send(placeOrder_resp);
                                                                });
                                                            }
                                                            else{
                                                                writeOrderCountStatistics(req.body["userId"], function(result) {
                                                                    res.send(placeOrder_resp);
                                                                });
                                                            }
                                                        });
                                                    }
                                                });

                                            }

                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });

        }
    } catch (error) {
        console.log('err 75' , err);
        let placeOrder_resp = {};
        placeOrder_resp.status = 500;
        placeOrder_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(placeOrder_resp);
    }
}

function formatOrderData(orderData) {
    try {
        return {
            customers:orderData[0]
        };
                    
    } catch (error) {
        console.log('formated erro', error);
        logger.info('Error occurred in formatting product Data', error);
    }

}

function reduceStock(userId, productsInOrder, callback) {
    try {
        console.log('productsInOrder=', productsInOrder);
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(productsInOrder['customers'].orders[0].orderDetails.products)) {
            let prodCount = 0;
            productsInOrder['customers'].orders[0].orderDetails.products.forEach(product=>{
                productModel.findById({ _id: userId },
                function(err, result){
                    if(err){
                        callback(false)
                    }
                    else{
                        if(!check.isUndefinedOrNullOrEmptyOrNoLen(result["products"] )){
                            result["products"].forEach(prod=>{
                                console.log(prod["_id"] , product["productId"])
                                if(prod["_id"] == product["productId"]){
                                    prod["stock"]  = prod["stock"]  - product["quantity"];
                                    console.log('saving', prod["_id"] , product["productId"]);
                                    result.save();
                                }
                            });
                        }
                    }
                    prodCount = prodCount + 1;
                    if(prodCount == productsInOrder['customers'].orders[0].orderDetails.products.length){
                        callback(true);
                    }
                    // console.log('result=',result, prodCount, productsInOrder['customers'].orders[0].orderDetails.products.length);
                });
            });
            
        }
        else {
            callback(false);
        }
    } catch (error) {
        console.log('err ', error)
        callback(false);
    }
};

function writeOrderCountStatistics(sellerId, callback) {
    try {
        
        let today = new Date();
        let dateKey = today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString();
        console.log('writeProductCountStatistics',dateKey, today.getDate(),today.getMonth(),today.getFullYear()  );
        statisticsModel.findOne({ _id: sellerId },
        function(err, result) {
            if(err){
                callback(false);
            }
            else{
                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                    statisticsModel.findOne({ _id: sellerId , "stat.currentDate" : dateKey},
                    function(err, resultStat){
                        if(err){
                            callback(false);
                        }
                        else{
                            if(!check.isUndefinedOrNullOrEmptyOrNoLen(resultStat)){
                                resultStat["stat"].forEach(statDay=>{
                                    if(statDay["currentDate"] == dateKey){
                                        statDay.orderCount = statDay.orderCount + 1;
                                        resultStat.save(function(err, result){
                                            if(err){
                                                console.log('err', err)
                                                callback(false);
                                            }
                                            else{
                                                callback(true);
                                            }
                                        });
                                    }
                                })
                                
                            }
                            else{
                                let statData = {
                                    currentDate: dateKey,
                                    orderCount : 1,
                                    customerCount: 0,
                                    rnrCount:0,
                                    productCount: 1
                                };
                                result["stat"].push(statData);
                                result.save(function(err, result){
                                    if(err){
                                        console.log('err', err)
                                        callback(false);
                                    }
                                    else{
                                        callback(true);
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    let statModelObj = new statisticsModel();
                    statModelObj._id = sellerId;
                    let statData = {
                        currentDate: dateKey,
                        orderCount : 1,
                        customerCount: 0,
                        rnrCount:0,
                        productCount: 0
                    };
                    statModelObj["stat"].push(statData);
                    statModelObj.save(function(err, result){
                        if(err){
                            console.log('err', err)
                            callback(false);
                        }
                        else{
                            callback(true);
                        }
                    });
                }
            }
        });
            
    } catch (error) {
        console.log('Err', error);
        callback(false);
    }
}

exports.getOrderByUserId = function (req, res) {
    try {
        let getOrderByUserId_resp = {};
        console.log('req.url', req.url);
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        let userId = params["userId"];
        let page = params["page"];
        let customerId = params["customerId"];
        
        
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) || !check.isUndefinedOrNullOrEmptyOrNoLen(customerId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
            let options = {
                select: 'customers.orders.added_date customers.customerId customers.orders.orderId customers.orders._id customers.orders.added_date customers.orders.orderStatus customers.orders.orderDetails customers.orders.additionalDetails customers.orders.paymentDetails customers.orders.orderStatus customers.orders.Awb_Number',
                sort: { 'customers.orders.added_date': -1 },
                page: page,
                limit: 90
            };
            orderModel.paginate({ _id: userId, "customers.customerId": customerId  }, options, function (err, result) {
                if (err) {
                    console.log('errrrr', err);
                    getOrderByUserId_resp.status = 500;
                    getOrderByUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getOrderByUserId_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        if(!check.isUndefinedOrNullOrEmptyOrNoLen(result.docs)){
                            getOrderByUserId_resp.status = 200;
                            // getOrderByUserId_resp.data = result.docs[0].customers[0].orders;

                            result.docs[0]["customers"].forEach(rr => {
                                console.log("orders", rr);
                                if (rr.customerId == customerId) {
                                    getOrderByUserId_resp.data = rr.orders;
                                }
                            });

                            console.log(result)
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }else{
                            getOrderByUserId_resp.status = 200;
                            getOrderByUserId_resp.data = [];
                            console.log(result)
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }
                        
                    }
                    else {
                        getOrderByUserId_resp.status = 204;
                        getOrderByUserId_resp.data = 'No Content';
                        res.status(204);
                        res.send(getOrderByUserId_resp);
                    }

                }
            });
        }
        else {
            getOrderByUserId_resp.status = 400;
            getOrderByUserId_resp.data = 'BAD Request !';
            res.status(400);
            res.send(getOrderByUserId_resp);
        }
    } catch (error) {
        logger.error('getProductsByUserId:: Error occurred', error);
        console.log('error', error);
        let getOrderByUserId_resp = {};
        getOrderByUserId_resp.status = 500;
        getOrderByUserId_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(getOrderByUserId_resp);
    }

}




exports.cancelOrder = function (req, res) {
    try {
        let cancelOrder_resp = {};
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            cancelOrder_resp.status = 422;
            cancelOrder_resp.data = 'Invalid Input';
            res.status(422);
            res.send(cancelOrder_resp);
        }
        else{
            let seller_id = req.body["sellerId"];
            let customerId = req.body["customerId"];
            let mongoOrderID = req.body["orderId"];
            console.log(seller_id)
            console.log(customerId)
            console.log(mongoOrderID)

            orderModel.findOne({ _id: seller_id, 'customers.customerId': customerId },
            function (err, result) {
                console.log(result);
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    result["customers"].forEach(rr => {
                        console.log("orders", rr);
                        if (rr.customerId == customerId) {
                            rr.orders.forEach(order => {
                                console.log("zzzz", order["_id"]);
                                if (order["_id"] == mongoOrderID) {
                                    console.log("aaaaa");
                                    order.orderStatus = 'cancel';
                                    order.save();
                                    result.save(function (err, result) {
                                        if (err) {
                                            cancelOrder_resp.status = 'failed';
                                            cancelOrder_resp.data = 'Order are not able to cancel.';
                                            res.status(500);
                                            res.send(cancelOrder_resp);
                                        }
                                        else {
                                            cancelOrder_resp.status = 'SUCCESS';
                                            cancelOrder_resp.data = 'Successfully canceled the order.';
                                            res.status(200);
                                            res.send(cancelOrder_resp);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    cancelOrder_resp.status = 'failed ';
                    cancelOrder_resp.data = 'Not able to get order';
                    res.status(500);
                    res.send(cancelOrder_resp);
                }
            });

        }

    }catch (error) {
        logger.error('cancelOrder:: Error occurred', error);
        console.log('error', error);
        let cancelOrder_resp = {};
        cancelOrder_resp.status = 500;
        cancelOrder_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(cancelOrder_resp);
    }

}