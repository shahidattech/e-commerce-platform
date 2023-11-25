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
var _ = require('lodash');
const moment = require('moment-timezone');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

exports.getOrderByUserId = function (req, res) {
    try {
        let getOrderByUserId_resp = {};
        console.log('req.url', req.url);
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        let userId = params["userId"];
        let page = Number(params["page"]);
        let limit = 50;
        console.log(userId, page)
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
            orderModel
            .find({ _id: userId })
            .select('customers.orders._id customers.customerId  customers.orders.added_date customers.orders.orderStatus customers.orders.orderDetails customers.orders.paymentDetails customers.orders.shippingDetails customers.orders.additionalDetails')
            .exec(function (err, result) {
                if (err) {
                    logger.error('Error in fetching order list', console.error);
                    getOrderByUserId_resp.status = 500;
                    getOrderByUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getOrderByUserId_resp);
                }
                else {
                    // let sortedOrders = [];
                    let orders = [];
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getOrderByUserId_resp.status = 200;
                        let customerCount = 0;
                        result[0]['customers'].forEach(CustOrders => {
                            customerCount = customerCount  + 1;
                            CustOrders['orders'].forEach(order=>{
                                if(order["orderStatus"] == "new" && order["paymentDetails"].paymendStatus =="COMPLETED"){
                                    orders.push(order);
                                }
                            });
                        });
                        let sortedOrders = _.sortBy(orders,"added_date").reverse();
                        console.log(sortedOrders.length ,limit ,page, customerCount, result[0]['customers'].length );
                        if(sortedOrders.length <= limit && page == 1 && customerCount == result[0]['customers'].length ){
                            getOrderByUserId_resp.data = sortedOrders;
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }
                        else if(sortedOrders.length >= limit && page == 1 && customerCount == result[0]['customers'].length ){
                            getOrderByUserId_resp.data = sortedOrders.slice(0,limit);
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }
                        else{
                            if( customerCount == result[0]['customers'].length ){
                                getOrderByUserId_resp.data = sortedOrders.slice(limit*(page - 1), limit*(page -1) + limit);
                                res.status(200);
                                res.send(getOrderByUserId_resp);
                            }

                        }
                    }
                    else {
                        console.log('No Content');
                        getOrderByUserId_resp.status = 204;
                        getOrderByUserId_resp.data = 'No Content';
                        // res.status(204);
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

exports.getPendingOrdersByUserId = function (req, res) {
    try {
        let getOrderByUserId_resp = {};
        console.log('getPendingOrdersByUserId::', req.url);
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        let userId = params["userId"];
        let page = Number(params["page"]);
        let limit = 50;
        console.log(userId, page)
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
            orderModel
            .find({ _id: userId })
            .select('customers.orders._id customers.customerId  customers.orders.added_date customers.orders.orderStatus customers.orders.orderDetails customers.orders.paymentDetails customers.orders.shippingDetails customers.orders.additionalDetails')
            .exec(function (err, result) {
                if (err) {
                    logger.error('Error in fetching order list', console.error);
                    getOrderByUserId_resp.status = 500;
                    getOrderByUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getOrderByUserId_resp);
                }
                else {
                    // let sortedOrders = [];
                    let orders = [];
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getOrderByUserId_resp.status = 200;
                        let customerCount = 0;
                        result[0]['customers'].forEach(CustOrders => {
                            customerCount = customerCount  + 1;
                            CustOrders['orders'].forEach(order=>{
                                if(order["paymentDetails"].paymendStatus =="PENDING"){
                                    let cus = {};
                                    cus.order = order;
                                    cus.customerId = CustOrders.customerId;
                                    orders.push(cus);
                                }
                            });
                        });
                        sleep(2500).then(()=>{
                            let sortedOrders = _.sortBy(orders,"added_date").reverse();
                            if(sortedOrders.length <= limit && page == 1 ){
                                getOrderByUserId_resp.data = sortedOrders;
                                res.status(200);
                                res.send(getOrderByUserId_resp);
                            }
                            else if(sortedOrders.length >= limit && page == 1 ){
                                getOrderByUserId_resp.data = sortedOrders.slice(0,limit);
                                res.status(200);
                                res.send(getOrderByUserId_resp);
                            }
                            else{
                                getOrderByUserId_resp.data = sortedOrders.slice(limit*(page - 1), limit*(page -1) + limit);
                                res.status(200);
                                res.send(getOrderByUserId_resp);
                            }
                        });
                    }
                    else {
                        console.log('No Content');
                        getOrderByUserId_resp.status = 204;
                        getOrderByUserId_resp.data = 'No Content';
                        // res.status(204);
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

exports.getshippiedOrdersByUserId = function (req, res) {
    try {
        let getOrderByUserId_resp = {};
        console.log('getPendingOrdersByUserId::', req.url);
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        let userId = params["userId"];
        let page = Number(params["page"]);
        let limit = 50;
        console.log(userId, page)
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
            orderModel
            .find({ _id: userId })
            .select('customers.orders._id customers.orders.labelURL customers.orders.ship_date  customers.orders.Awb_Number customers.customerId  customers.orders.added_date customers.orders.orderStatus customers.orders.orderDetails customers.orders.paymentDetails customers.orders.shippingDetails customers.orders.additionalDetails')
            .exec(function (err, result) {
                if (err) {
                    logger.error('Error in fetching order list', console.error);
                    getOrderByUserId_resp.status = 500;
                    getOrderByUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getOrderByUserId_resp);
                }
                else {
                    // let sortedOrders = [];
                    let orders = [];
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getOrderByUserId_resp.status = 200;
                        let customerCount = 0;
                        result[0]['customers'].forEach(CustOrders => {
                            customerCount = customerCount  + 1;
                            CustOrders['orders'].forEach(order=>{
                                if(order["orderStatus"] =="PICKUP_GENERATED"){
                                    let cus = {};
                                    cus.order = order;
                                    cus.customerId = CustOrders.customerId;
                                    orders.push(cus);
                                }
                            });
                        });
                        let sortedOrders = _.sortBy(orders,"ship_date").reverse();
                        console.log(sortedOrders.length ,limit ,page, customerCount, result[0]['customers'].length );
                        if(sortedOrders.length <= limit && page == 1 && customerCount == result[0]['customers'].length ){
                            getOrderByUserId_resp.data = sortedOrders;
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }
                        else if(sortedOrders.length >= limit && page == 1 && customerCount == result[0]['customers'].length ){
                            getOrderByUserId_resp.data = sortedOrders.slice(0,limit);
                            res.status(200);
                            res.send(getOrderByUserId_resp);
                        }
                        else{
                            if( customerCount == result[0]['customers'].length ){
                                getOrderByUserId_resp.data = sortedOrders.slice(limit*(page - 1), limit*(page -1) + limit);
                                res.status(200);
                                res.send(getOrderByUserId_resp);
                            }

                        }
                    }
                    else {
                        console.log('No Content');
                        getOrderByUserId_resp.status = 204;
                        getOrderByUserId_resp.data = 'No Content';
                        // res.status(204);
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

exports.updateOrderStatus = function(req, res){
    let updateOrderStatus_resp = {};
    try {
        console.log('req.body', req.body);
        orderModel.findById({_id:req.body["seller_id"] } , function(err, result){
            if(err){
                logger.error('Failed to find the order to update the Order shipping status & AWB Number', err);
                updateOrderStatus_resp.status = 500;
                updateOrderStatus_resp.data = 'Failed to find the order to update the Order shipping status & AWB Number';
                res.send(updateOrderStatus_resp);
            }
            else{
                result['customers'].forEach(CustOrders => {
                    CustOrders['orders'].forEach(order=>{
                        if(order["orderStatus"] == "new" && order["_id"] ==req.body["order_id"]){
                            order["orderStatus"] = "PICKUP_GENERATED";
                            order["Awb_Number"] = req.body["Awb_Number"];
                            order["labelURL"] = req.body["labelURL"];
                            order["ship_date"] = new Date();
                            result.save(function(err, result){
                                if(err){
                                    updateOrderStatus_resp.status = 500;
                                    updateOrderStatus_resp.data = 'Failed to to update the Order shipping status & AWB Number';
                                    res.send(updateOrderStatus_resp);
                                }
                                else{
                                    updateOrderStatus_resp.status = 200;
                                    updateOrderStatus_resp.data = 'Successfully updated Order shipping status & AWB Number';
                                    res.send(updateOrderStatus_resp);
                                }
                            });
                        }
                    });
                });
            }
        })
    } catch (error) {
        logger.error('Error occurred while updating the Order status POST ship', error);
        updateOrderStatus_resp.status = 500;
        updateOrderStatus_resp.data = 'Internal Server error';
        res.send(updateOrderStatus_resp);
    }
}


exports.pendingOrderPaymentStatusComplete = function (req, res) {
    let successPayment_resp = {};
    try {
        let seller_id = req.body["seller_id"];
        let customerId = req.body["customerId"]
        let orderId = req.body["orderId"];
        
        orderModel.findOne({ _id: seller_id },
            function (err, result) {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    // console.log('result', result["customers"][0]["orders"]);
                    result["customers"].forEach(customer => {
                        if(customer["customerId"] == customerId){
                            customer["orders"].forEach(order=>{
                                if(order["_id"] == orderId){
                                    order.paymentDetails.paymendStatus = 'COMPLETED';
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
                                            res.send(successPayment_resp);
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
        logger.error("paymentStatusComplete :: Error Occurred while payment status update" , error );
        successPayment_resp.status = 'failed ';
        successPayment_resp.data = 'Not able to track the order';
        res.status(500);
        res.send(successPayment_resp);
    }
}

exports.getOrderByDate = function (req, res) {
    try {
        let getOrderByDate_resp = {};
        console.log('req.url', req.url);
        // var url_data = url.parse(req.url, true);
        // var params = url_data.query;
        // let userId = params["userId"];
        // let page = Number(params["page"]);
        // let limit = 50;
        // console.log(userId, page);
        
        let inputData = req.body;
        console.log(inputData);
        let userId = inputData.userId;
        let start_Date = inputData.startDate;
        let end_Date = inputData.endDate;

        // if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(inputData) || !check.isUndefinedOrNullOrEmptyOrNoLen(userId) ||  !check.isUndefinedOrNullOrEmptyOrNoLen(start_Date) || !check.isUndefinedOrNullOrEmptyOrNoLen(end_Date)) {
            orderModel
            .find({ _id: userId })
            .select('customers.orders._id customers.customerId  customers.orders.added_date customers.orders.orderStatus customers.orders.orderDetails customers.orders.paymentDetails customers.orders.shippingDetails customers.orders.additionalDetails')
            .exec(function (err, result) {
                if (err) {
                    logger.error('Error in fetching order list', console.error);
                    getOrderByDate_resp.status = 500;
                    getOrderByDate_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getOrderByDate_resp);
                }
                else {
                    let orders = [];
                    var startDate   = moment(start_Date, "DD/MM/YYYY");
                    var endDate     = moment(end_Date, "DD/MM/YYYY");

                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getOrderByDate_resp.status = 200;
                        let customerLength = result[0]['customers'].length;
                        result[0]['customers'].forEach((CustOrders, index) => {
                            CustOrders['orders'].forEach(order=>{
                                // if(order["orderStatus"] == "new" && order["paymentDetails"].paymendStatus =="COMPLETED"){
                                var compareDate = moment(order["added_date"], "DD/MM/YYYY");
                                if(compareDate.isBetween(startDate, endDate) || compareDate.isSame(startDate, 'day') || compareDate.isSame(endDate, 'day')){
                                    orders.push(order);
                                }
                                // }
                            });

                            if(customerLength == index + 1){
                                setTimeout(() => {
                                    let sortedOrders = _.sortBy(orders,"added_date").reverse();
                                    getOrderByDate_resp.data = sortedOrders;
                                    res.status(200);
                                    res.send(getOrderByDate_resp);    
                                }, 500);
                            }
                        });
                    }
                    else {
                        console.log('No Content');
                        getOrderByDate_resp.status = 204;
                        getOrderByDate_resp.data = 'No Content';
                        res.send(getOrderByDate_resp);
                    }

                }
            });
            
        }
        else {
            getOrderByDate_resp.status = 400;
            getOrderByDate_resp.data = 'BAD Request !';
            res.status(400);
            res.send(getOrderByDate_resp);
        }
    } catch (error) {
        logger.error('getProductsByUserId:: Error occurred', error);
        console.log('error', error);
        let getOrderByDate_resp = {};
        getOrderByDate_resp.status = 500;
        getOrderByDate_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(getOrderByDate_resp);
    }

}