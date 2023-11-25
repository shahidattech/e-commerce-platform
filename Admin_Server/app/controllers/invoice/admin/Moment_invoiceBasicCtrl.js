var path = require('path');
var async = require('async');
var moment = require('moment')
var logger = require('logger').createLogger();
var orderModel = require('mongoose').model('orderModel');
var invoiceModel = require('mongoose').model('invoiceModel');
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var config = require(path.join(__dirname, '..', '..', '..', 'global', 'config', 'appConfig'));
var createGstInvoice = require(path.join(__dirname, '..', '..', '..', 'service', 'invoiceGenrator', 'createGstInvoice'));
var productModel = require('mongoose').model('Product');
let awsService = require(path.join(__dirname, '..', '..', '..', 'service', 'common', 'awsService'));



function calculates(CustOrders,userId, storeInfo, callback){
    // let today = new Date();
    // let year = today.getFullYear()
    // let current_month = today.getMonth()

    let today = moment();
    let year = today.year()
    let current_month = today.month()
    let totalProductPrice = 0;
    let ctax = 0;
    let stax = 0;
    console.log('CustOrders ID', CustOrders.customerId)
    CustOrders['orders'].forEach(order => {
        // console.log('56', orderlen , orderCounter, CustOrders['orders'].length,orderResult[0]['customers'].length );
        let addedDate = moment(order["added_date"])
        console.log('addedDate=',addedDate, addedDate.month(), current_month )
        if (addedDate.month() + 1 == current_month) {
            if (order["paymentDetails"].paymendStatus == "COMPLETED") {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(order["paymentDetails"].paymendStatus)) {
                    order["orderDetails"].products.forEach(product => {
                        console.log('Product ID=', product["productId"]);
                        productModel.findOne({ _id: userId },
                            { "products": { $elemMatch: { _id: product["productId"] } } },
                            function (err, result) {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result) && !check.isUndefinedOrNullOrEmptyOrNoLen(result["products"][0])) {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result["products"][0]["attributes"])) {
                                        totalProductPrice = totalProductPrice + Number(result["products"][0]["attributes"][0].price)
                                        let indivtax = Number(result["products"][0]["attributes"][0].price) * Number(result["products"][0]["gst"]) / 100;
                                        if (order["shippingDetails"].state == storeInfo[0]["state"] || order["shippingDetails"].state.toLowerCase().replace(/\s+/g, '') =='westbengal') {
                                            ctax = ctax + indivtax / 2;
                                            stax = stax + indivtax / 2;
                                        }
                                        else {
                                            ctax = ctax + indivtax;
                                        }
                                        let tax_sale_Values = {};
                                        tax_sale_Values.totalProductPrice = totalProductPrice;
                                        tax_sale_Values.ctax = ctax;
                                        tax_sale_Values.stax = stax;
                                        callback(tax_sale_Values)
                                    }
                                }
                            });
                    });
                }
            }
        }
    });

}
exports.generateGSTInvoice = function (req, res) {
    console.log('generateGSTInvoice', req.body["userId"]);
    let generateGSTInvoice_resp = {};
    try {
        let userId = req.body["userId"];
        // let today = new Date();
        // let year = today.getFullYear()
        // let current_month = today.getMonth()
        // console.log('Previous Month First day=', year, current_month)

        // {"customers.orders.added_date": {"$gte": "2021-05-01", "$lt": "2021-05-30"}
        homeConfigTheme1Model.find({ _id: userId }, function (err, storeInfo) {
            if (err) {
                generateGSTInvoice_resp.status = 500;
                generateGSTInvoice_resp.data = 'Not able to find Store info';
                res.send(generateGSTInvoice_resp);
            }
            else {
                async.waterfall([function functionCalculateTax(next) {
                    try {
                        orderModel.find({ _id: userId},
                         function(err, orderResult){
                            if (err) {
                                logger.error('Error in fetching order list', err);
                                generateGSTInvoice_resp.status = 500;
                                generateGSTInvoice_resp.data = 'Internal Server Error';
                                res.status(500);
                                res.send(generateGSTInvoice_resp);
                            }
                            else {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(orderResult)) {
                                    // 100497694813034331151
                                    let lastCustomerId = orderResult[0].customers[orderResult[0].customers.length -1].customerId;
                                    console.log('47', orderResult[0].customers[orderResult[0].customers.length -1].customerId)
                                    let counter = 0;
                                    let totalProductPrice = 0;
                                    let ctax = 0;
                                    let stax = 0;
                                    orderResult[0]['customers'].forEach(async(CustOrders) => {
                                        await calculates(CustOrders, userId, storeInfo, function(result){
                                            if(err){
                                                console.log('56')
                                            }
                                            else{
                                                console.log('result', result)
                                                totalProductPrice = totalProductPrice + result.totalProductPrice;
                                                ctax = ctax + result.ctax;
                                                stax = stax + result.stax;
                                                if(lastCustomerId == CustOrders.customerId){
                                                    let tax_sale_Values = {};
                                                    tax_sale_Values.totalProductPrice = totalProductPrice;
                                                    tax_sale_Values.ctax = ctax;
                                                    tax_sale_Values.stax = stax;
                                                    console.log('tax_sale_Values=', tax_sale_Values);
                                                    next(null, tax_sale_Values);
                                                }
                                                
                                            }
                                        });
                                    });
                                }
                                else {
                                    generateGSTInvoice_resp.status = 200;
                                    generateGSTInvoice_resp.data = 'No Record found!!';
                                    res.status(500);
                                    res.send(generateGSTInvoice_resp);
                                }
                            }
                        });
                    } catch (error) {
                        console.log('Error  functionCalculateTax', error);
                    }
                },
                function stepOnecreateInvoiceNumber(tax_sale_Values, next) {
                    try {
                        console.log('102', tax_sale_Values);
                        let today = new Date();
                        let invoiceNumber = storeInfo[0]["storeGeneralInfo"].brandName.replace(/\s/g, '') + "_" + today.getMonth().toString() + today.getFullYear().toString();
                        let gst_no = "";
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(storeInfo[0]["storeGeneralInfo"].gstNo)) {
                            gst_no = storeInfo[0]["storeGeneralInfo"].gstNo;
                        }
                        else {
                            gst_no = "Not Available";
                        }
                        let totalProductPrice = tax_sale_Values.totalProductPrice;
                        let ctax = tax_sale_Values.ctax;
                        let stax = tax_sale_Values.stax;
                        console.log('totalProductPrice', totalProductPrice, ctax, stax);
                        let data = {
                            "sellerName": storeInfo[0]["storeGeneralInfo"].brandName,
                            "imageLogo": storeInfo[0]["storeGeneralInfo"].phoneNumber + ".jpg",
                            "SellerAddress": storeInfo[0]["storeGeneralInfo"].storePhysicalAddress,
                            "State": storeInfo[0]["storeGeneralInfo"].state,
                            "pin": storeInfo[0]["storeGeneralInfo"].pinCode,
                            "GSTIN": storeInfo[0]["storeGeneralInfo"].gstNo,
                            "PAN": storeInfo[0]["storeGeneralInfo"].panNo,
                            "phone_no": storeInfo[0]["storeGeneralInfo"].phoneNumber,
                            "Invoice_No": invoiceNumber,
                            "Invoice_Date": (new Date()).toISOString().split('T')[0],
                            // "Invoice_Date": today,
                            "Product_details": "Monthly Sell from Website for the Month of" + today.getMonth().toString() + today.getFullYear().toString(),
                            "base_price": totalProductPrice.toFixed(2),
                            "sgst": stax,
                            "cgst": ctax,
                            "total": (totalProductPrice + stax + ctax).toFixed(2),
                            "purchaseDetail": {
                                "Trx_date": today,
                                "trx_amt": totalProductPrice + stax + ctax
                            }
                        };
                        createGstInvoice.createGstInvoice(invoiceNumber + ".pdf", data, function (invoiceCeationresult) {
                            next(null, invoiceCeationresult, data);
                        });
                    } catch (error) {
                        console.log('Error  stepOnecreateInvoiceNumber', error);
                    }
                }, function step2Uploadtos3(invoiceCeationresult, data, next) {
                    try {
                        let data_aws = {
                            FILEPATH: config.PROD_INVOICE_PATH + data.Invoice_No + ".pdf",
                            // FILEPATH: data.Invoice_No + ".pdf",
                            KEY: data.Invoice_No + ".pdf",
                            BUCKET: config.AWS_S3_BUCKET
                        };
                        // console.log('data_aws=', data_aws);
                        awsService.uploadFileToS3(data_aws, function (AwsRsponse) {
                            next(null, AwsRsponse, data);
                        })
                    } catch (error) {
                        console.log('Error  step2Uploadtos3', error);
                    }
                }, function insertEntryinDB(AwsRsponse, data, next) {
                    try {
                        let today = new Date();
                        let key = today.getMonth().toString() + today.getFullYear().toString();
                        let invoice = {
                            year_month: key,
                            total_sale_value: data.total,
                            total_tax: Number(data.sgst) + Number(data.cgst),
                            cgst: data.cgst,
                            sgst: data.sgst,
                            invoiceURL: AwsRsponse["Location"]
                        };
                        invoiceModel.findById({ _id: userId }, function (err, result) {
                            if (err) {
                                generateGSTInvoice_resp.status = 500;
                                generateGSTInvoice_resp.data = 'Error in Invoice creation when finding the invoice for the month';
                                res.send(generateGSTInvoice_resp);

                            }
                            else {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                    invoiceModel.update({ _id: userId, 'invoices.year_month': key },
                                        { $set: { 'invoices.$': invoice } }, function (err, result) {
                                            if (err) {
                                                generateGSTInvoice_resp.status = 500;
                                                generateGSTInvoice_resp.data = 'Error in updating invoice';
                                                res.send(generateGSTInvoice_resp);
                                            }
                                            else {
                                                console.log('144', result);
                                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result) && result['nModified'] == 1) {
                                                    generateGSTInvoice_resp.status = 200;
                                                    generateGSTInvoice_resp.data = 'Successfully updated';
                                                    res.send(generateGSTInvoice_resp);
                                                }
                                                else {
                                                    invoiceModel.update({ _id: userId }, { $push: { 'invoices': invoice } },
                                                        function (err, result) {
                                                            if (err) {
                                                                generateGSTInvoice_resp.status = 500;
                                                                generateGSTInvoice_resp.data = 'Error in updating invoiceModel';
                                                                res.send(generateGSTInvoice_resp);
                                                            }
                                                            else {
                                                                generateGSTInvoice_resp.status = 200;
                                                                generateGSTInvoice_resp.data = 'Successfully updated the first invoice entry';
                                                                res.send(generateGSTInvoice_resp);
                                                            }
                                                        })
                                                }
                                            }
                                        });
                                }
                                else {
                                    let invoiceObj = new invoiceModel();
                                    invoiceObj._id = userId;
                                    invoiceObj["invoices"].push(invoice);
                                    invoiceObj.save(function (err, result) {
                                        if (err) {
                                            generateGSTInvoice_resp.status = 500;
                                            generateGSTInvoice_resp.data = 'Error in creating and adding first entry invoiceModel';
                                            res.send(generateGSTInvoice_resp);
                                        }
                                        else {
                                            generateGSTInvoice_resp.status = 200;
                                            generateGSTInvoice_resp.data = 'Successfully created the first invoice Entry';
                                            res.send(generateGSTInvoice_resp);
                                        }
                                    })
                                }
                            }
                        });
                    } catch (error) {
                        console.log('Error  insertEntryinDB', error);
                    }
                }], function (err) {
                    if (err) {
                        console.log('Error Occurred 229', err);
                        generateGSTInvoice_resp.status = 500;
                        generateGSTInvoice_resp.data = 'Error in Invoice creation';
                        res.send(generateGSTInvoice_resp);

                    }
                });
            }
        });

    } catch (error) {
        console.log('error', error);
    }
}