/* global __dirname */
var mongoose = require('mongoose');
var path = require('path');
var homepageModel = require(path.join(__dirname, '..', '..', '..', 'models', 'homepage', 'homepageModel'));
var homeConfigModel = require(path.join(__dirname, '..', '..', '..', 'models', 'home-config', 'homeConfigModel'));
var slideshowModel = require(path.join(__dirname, '..', '..', '..', 'models', 'slideshow', 'slideshowModel'));
var slideshowHome = require(path.join(__dirname, '..', '..', '..', 'models', 'homepage', 'slideshowhomepageModel'));
var customerModel = require(path.join(__dirname, '..', '..', '..', 'models', 'customer', 'customerModel'));
var productModel = require(path.join(__dirname, '..', '..', '..', 'models', 'product', 'productModel'));
var categoryMainModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-main', 'categoryMain'));
var categorySubModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-sub', 'categorySub'));
var categorySubSubModel = require(path.join(__dirname, '..', '..', '..', 'models', 'category-sub-sub', 'categorySubSub'));
var ordersModel = require(path.join(__dirname, '..', '..', '..', 'models', 'orders', 'ordersModel'));
var sliderModel = require(path.join(__dirname, '..', '..', '..', 'models', 'slider', 'sliderModel'));
var paymentKeysModel = require(path.join(__dirname, '..', '..', '..', 'models', 'bank-keys', 'paymentKeysModel'));
var statisticsModel = require(path.join(__dirname, '..', '..', '..', 'models', 'statistics', 'statisticsModel'));


module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db, { useNewUrlParser: true , useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('globalbazar db opened');
    });
};