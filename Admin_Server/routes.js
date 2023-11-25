/* global __dirname */
var path = require('path');
var userApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'userAccount', 'userApi'));
var authApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'userAccount', 'authApi'));
var productApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'product', 'productApi'));
var ordersApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'orders', 'ordersApi'));
var tagsApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'product', 'tagApi'));
var slideShowApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'slideShow', 'slideShowApi'));
var sliderApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'sliders', 'sliderApi'));
var categoriesApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'categories', 'categoriesApi'));
var homeConfigApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'homeConfig', 'HomeConfigApi'));

module.exports = function(app) {
//console.log(middleware)
    //User authentication management
    authApi(app);
    //User data management
    userApi(app,middleware);
    productApi(app,middleware);
    tagsApi(app,middleware);
    slideShowApi(app,middleware);
    sliderApi(app,middleware);
    // administrationApi(app);
    // siteconfigApi(app);
    categoriesApi(app);
    homeConfigApi(app,middleware);
    ordersApi(app);
};
