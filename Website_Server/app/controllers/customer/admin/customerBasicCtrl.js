var logger = require('logger').createLogger();
const { validationResult } = require('express-validator');
var path = require('path');
var url = require('url');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
const { Mongoose } = require('mongoose');
var customerModel = require('mongoose').model('customerModel');
var statisticsModel = require('mongoose').model('statisticsModel');



exports.createCustomer = function (req, res) {
    let createCustomer_resp = {};
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            createCustomer_resp.status = 422;
            createCustomer_resp.data = errors;
            // res.status(422);
            res.send(createCustomer_resp);
        }
        else {
            let sellerId = req.body["_id"];
            let custData = req.body["customer"];
            //Find Seller & customer
            customerModel.findOne({ _id: sellerId, "customers.customerId": req.body["customer"].customerId }, { "customers.$.customerId": req.body["customer"].customerId },
                function (err, result) {
                    //If seller exists
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        //Match to find the customer postion in the list
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result["customers"])) {
                            result["customers"].forEach(customer => {
                                if (customer["customerId"] == req.body["customer"].customerId) {
                                    customer.email = req.body["customer"].customerId;
                                    customer.phoneNo = req.body["customer"].phoneNo;
                                    customer.fullName = req.body["customer"].fullName;
                                    customer.shippingAddress = req.body["customer"].shippingAddress;
                                    result.save(function (err, result) {
                                        if (err) {
                                            createCustomer_resp.status = 500;
                                            createCustomer_resp.data = 'Error while saving the the profile';
                                            res.send(createCustomer_resp);
                                        }
                                        else {
                                            createCustomer_resp.status = 200;
                                            createCustomer_resp.data = 'Successfully updated the profile';
                                            res.send(createCustomer_resp);
                                        }
                                    });
                                }
                            });
                        }
                        //Not able to find the Customer
                        else {
                            createCustomer_resp.status = 500;
                            createCustomer_resp.data = 'Not able to match the Customer';
                            res.send(createCustomer_resp);
                        }
                    }
                    else {
                        //Customer Does't exists Seller May or May not exists
                        customerModel.findById({ _id: sellerId }, function (err, result) {
                            if (err) {
                                createCustomer_resp.status = 500;
                                createCustomer_resp.data = 'Failed to find the Seller';
                                res.send(createCustomer_resp);
                            }
                            else {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                    //Seller Exists
                                    result["customers"].push(custData);
                                    result.save(function (err, result) {
                                        if (err) {
                                            createCustomer_resp.status = 500;
                                            createCustomer_resp.data = 'Error while saving the the profile';
                                            res.send(createCustomer_resp);
                                        }
                                        else {
                                            createCustomer_resp.status = 200;
                                            createCustomer_resp.data = 'Successfully appended the profile';
                                            writeCustomerCountStatistics(sellerId, function(result) {
                                                res.send(createCustomer_resp);
                                            });
                                        }
                                    });
                                }
                                else {
                                    //Seller or Customer Does'nt Exists
                                    let custObj = new customerModel();
                                    custObj._id = sellerId;
                                    custObj.customers.push(custData);
                                    custObj.save(function (err, result) {
                                        if (err) {
                                            createCustomer_resp.status = 500;
                                            createCustomer_resp.data = 'Error while saving the the profile';
                                            res.send(createCustomer_resp);
                                        }
                                        else {
                                            createCustomer_resp.status = 200;
                                            createCustomer_resp.data = 'Successfully Added the profile';
                                            writeCustomerCountStatistics(sellerId, function(result) {
                                                res.send(createCustomer_resp);
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
        logger.error('Error occurred while updating custmer profile');
        createCustomer_resp.status = 500;
        createCustomer_resp.data = 'Internal Server Error';
        res.send(createCustomer_resp);
    }
}

function writeCustomerCountStatistics(sellerId, callback) {
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
                                        statDay.customerCount = statDay.customerCount + 1;
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
                                    orderCount : 0,
                                    customerCount: 1,
                                    rnrCount:0,
                                    productCount: 0
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
                        orderCount : 0,
                        customerCount: 0,
                        rnrCount:1,
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

exports.getCustomerByCustId = function (req, res) {
    let getCustomerByCustId_resp = {};
    try {
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        var sellerId = params.sellerId;
        var customerId = params.customerId;
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(sellerId) && !check.isUndefinedOrNullOrEmptyOrNoLen(customerId)) {
            customerModel.findOne({ _id: sellerId, "customers.customerId": customerId},
                { "customers.$.customerId": customerId },
                function (err, result) {
                    if(err){
                        getCustomerByCustId_resp.status = 500;
                        getCustomerByCustId_resp.data = 'Failed to find the user due to error';
                        res.send(getCustomerByCustId_resp);
                    }
                    else{
                        if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                            getCustomerByCustId_resp.status = 200;
                            getCustomerByCustId_resp.data = result;
                            res.send(getCustomerByCustId_resp);
                        }
                        else{
                            getCustomerByCustId_resp.status = 204;//No Content
                            res.send(getCustomerByCustId_resp);
                        }
                       
                    }
                });
        }
        else {
            getCustomerByCustId_resp.status = 422;
            getCustomerByCustId_resp.data = 'Invalid input';
            res.send(getCustomerByCustId_resp);
        }
    } catch (error) {
        console.log('error', error)
        getCustomerByCustId_resp.status = 500;
        getCustomerByCustId_resp.data = 'Internal Server Error';
        res.send(getCustomerByCustId_resp);
    }
}
