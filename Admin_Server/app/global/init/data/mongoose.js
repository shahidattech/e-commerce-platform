/* global __dirname */
var mongoose = require('mongoose');
var path = require('path');
var productModel = require(path.join(__dirname, '..', '..', '..', 'models', 'product', 'productModel'));
var tagModel = require(path.join(__dirname, '..', '..', '..', 'models', 'tag', 'tagModel'));
var articleModel = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleModel'));
var userModel = require(path.join(__dirname, '..', '..', '..', 'models', 'user', 'userModel'));
var subscriberModel = require(path.join(__dirname, '..', '..', '..', 'models', 'user', 'subscriberModel'));
var administrationModel = require(path.join(__dirname, '..', '..', '..', 'models', 'administration', 'administrationModel'));
var articleHome = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'articleHome'));
var slideshowHome = require(path.join(__dirname, '..', '..', '..', 'models', 'slideShow', 'slideshowHome'));
var siteConfigHome = require(path.join(__dirname, '..', '..', '..', 'models', 'article', 'siteConfigHome'));
var slideShowModel = require(path.join(__dirname, '..', '..', '..', 'models', 'slideShow', 'slideShowModel'));
var homeConfigModel = require(path.join(__dirname, '..', '..', '..', 'models', 'home-config', 'homeConfigModel'));
var CategoryMainModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-main', 'categoryMain'));
var CategorySubModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-sub', 'categorySub'));
var CategorySubSubModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-sub-sub', 'categorySubSub'));
var sliderModel = require(path.join(__dirname, '..', '..', '..', 'models', 'slider', 'sliderModel'));
var orderModel = require(path.join(__dirname, '..', '..', '..', 'models', 'orders', 'ordersModel'));
var paymentKeysModel = require(path.join(__dirname, '..', '..', '..', 'models', 'bank-keys', 'paymentKeysModel'));
var razorPaypaymentKeysModel = require(path.join(__dirname, '..', '..', '..', 'models', 'bank-keys', 'razorPaypaymentKeysModel'));
var customerModel = require(path.join(__dirname, '..', '..', '..', 'models', 'customer', 'customerModel'));
var statisticsModel = require(path.join(__dirname, '..', '..', '..', 'models', 'statistics', 'statisticsModel'));
var invoiceModel = require(path.join(__dirname, '..', '..', '..', 'models', 'invoice', 'gstInvoiceModel'));
var sucscriptionModel = require(path.join(__dirname, '..', '..', '..', 'models', 'subscription', 'subscriptionModel'));


module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db,{ 
        useNewUrlParser: true,
        // useFindAndModify: false,
        useUnifiedTopology: true });

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('mybrand db opened');
    });
};
