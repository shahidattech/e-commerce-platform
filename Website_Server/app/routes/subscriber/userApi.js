/* global __dirname */
var Path = require('path');
const { check } = require('express-validator');
var customerCtrl = require(Path.join(__dirname, '..', '..', 'controllers', 'customer', 'customerMasterCtrl'));
var jwt = require(Path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
module.exports = function(app, upload){
    var default_url_path = '/api/v1/website/subscriber/';

    app.post(default_url_path + 'createCustomer', 
    [check('customer.customerId').isLength({min:2}).withMessage('You must log in to update profile'),
    check('customer.phoneNo').isLength({min:2}).withMessage('You must log in to update profile'),
    check('customer.fullName').isLength({min:2}).withMessage('You must enter fullName')],
    customerCtrl.createCustomer);
    app.get(default_url_path + 'getCustomerByCustId', customerCtrl.getCustomerByCustId);
}