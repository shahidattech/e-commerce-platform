/* global __dirname */
var path = require('path');
var homeApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'homepage', 'homeApi'));
var productApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'products', 'productsApi'));
var ordersApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'orders', 'ordersApi'));
var paymentApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'payumoney', 'payumoneyRoute'));
var razorpaymentApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'razorpay', 'razorpayRoute'));
var userApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'subscriber', 'userApi'));

module.exports = function(app) {

    //User authentication management
    userApi(app);
    // authApi(app);
    homeApi(app);
    productApi(app);
    ordersApi(app);
    paymentApi(app);
    razorpaymentApi(app);
};
