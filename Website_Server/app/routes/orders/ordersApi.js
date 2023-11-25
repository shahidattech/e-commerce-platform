var path = require('path');
const { check } = require('express-validator');
var orderCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'orders', 'ordersMasterCtrl'));
var jwt = require(path.join(__dirname, "..", "..", "service", "auth", "jwt"));

module.exports = function(app) {
    var default_url_path = '/api/v1/website/orders/';
    app.post(default_url_path + 'placeOrder',
        // [check('orderDetails[products]').isLength({min:1}).withMessage('You must place product first in your bucket'),
        // check('shippingDetails.customerName').isLength({min:1}).withMessage('Please provide your Name')],
         orderCtrl.placeAnOrder);
    // app.get(default_url_path + 'getCategories', productCtrl.getCategories);
    app.get(default_url_path + 'getOrderByUserId', orderCtrl.getOrderByUserId);
    app.post(default_url_path + 'cancelOrder', orderCtrl.cancelOrder);
}

