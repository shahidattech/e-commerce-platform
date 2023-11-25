var path = require('path');
var orderCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'orders', 'ordersMasterCtrl'));
var jwt = require(path.join(__dirname,'..','..', 'service', 'auth','jwt'));
var featureChecker = require(path.join(__dirname, '..','..', 'service', 'auth','featureChecker'));
const { check } = require('express-validator');

module.exports = function(app) {
    var default_url_path = '/api/v1/orders/';
    app.get(default_url_path + 'getOrderByUserId', orderCtrl.getOrderByUserId);
    app.get(default_url_path + 'getPendingOrdersByUserId', orderCtrl.getPendingOrdersByUserId);
    app.get(default_url_path + 'getshippiedOrdersByUserId', orderCtrl.getshippiedOrdersByUserId);
    app.post(default_url_path + 'updateOrderStatus', orderCtrl.updateOrderStatus);
    app.post(default_url_path + 'pendingOrderPaymentStatusComplete', orderCtrl.pendingOrderPaymentStatusComplete);
    app.post(default_url_path + 'getOrderByDate', orderCtrl.getOrderByDate);
}

