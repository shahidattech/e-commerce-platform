var path = require('path');
var productCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'product', 'productMasterCtrl'));
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
var featureChecker = require(path.join(__dirname, '..', '..', 'service', 'auth', 'featureChecker'));
const { check } = require('express-validator');

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/product/';
  app.post(default_url_path + 'createproduct', jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    [check('title').isLength({ min: 3 }).withMessage('Please Enter a title of minimum 3 character')],
    [check('short_title').isLength({ min: 3 }).withMessage('Please Enter a short title of minimum 3 character')],
    productCtrl.createProduct);

  app.post(default_url_path + 'updateproduct', jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    [check('title').isLength({ min: 3 }).withMessage('Please Enter a title of minimum 3 character')],
    [check('short_title').isLength({ min: 3 }).withMessage('Please Enter a short title of minimum 3 character')],
    productCtrl.updateProduct);

  app.post(default_url_path + 'getProductsByUserId',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productCtrl.getProductsByUserId);

  app.post(default_url_path + 'deleteProduct',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productCtrl.delectProductsById);

  app.get(default_url_path + 'getProducts', productCtrl.getProducts);

  app.post(default_url_path + 'productSaveCategoryWise', jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productCtrl.saveProductinCatSubcatSubSubCat);

  app.post(default_url_path + 'getProductsByProductIdUserId',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productCtrl.getProductsByProductIdUserId);

  app.get(default_url_path + 'getReviewedProducts', productCtrl.getReviewedProducts);
  app.post(default_url_path + 'updateReviewedProducts',
    // jwt.validateToken,
    productCtrl.updateReviewedProducts);
};

