var path = require('path');
var productCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'products', 'productMasterCtrl'));
var jwt = require(path.join(__dirname, "..", "..", "service", "auth", "jwt"));
const { check } = require('express-validator');

module.exports = function(app) {
    var default_url_path = '/api/v1/website/product/';
    app.get(default_url_path + 'getProductByID',productCtrl.getProductByID);
    app.get(default_url_path + 'getProductByCategoryID', productCtrl.getProductByCategoryID);
    app.get(default_url_path + 'getProductBySubCategoryID', productCtrl.getProductBySubCategoryID);
    app.get(default_url_path + 'getProductBySubSubID', productCtrl.getProductBySubSubID);
    app.get(default_url_path + 'getCategories', productCtrl.getCategories);
    app.post(default_url_path + 'addRatingAdnReviews',
        [check('userId').isLength({min:8}).withMessage('Missing SellerId'),
        check('customerId').isLength({min:8}).withMessage('Missing customerId'),
        check('productId').isLength({min:8}).withMessage('Missing productId')],
        productCtrl.addRatingAdnReviews);

    
    
    
    // app.get(default_url_path + 'getCategories', productCtrl.getCategories);
}

