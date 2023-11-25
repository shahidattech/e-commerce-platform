var path = require('path');
var invoiceCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'invoice', 'invoiceMasterCtrl'));
var jwt = require(path.join(__dirname,'..','..', 'service', 'auth','jwt'));
var featureChecker = require(path.join(__dirname, '..','..', 'service', 'auth','featureChecker'));
const { check } = require('express-validator');

module.exports = function(app) {
    var default_url_path = '/api/v1/invoice/';
    app.post(default_url_path + 'generateGSTInvoice', invoiceCtrl.generateGSTInvoice);
}

