var path = require('path');
var productCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'product', 'productMasterCtrl'));
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');
var productValidator = require('../../validation/controller/productVald');

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/product/';

  app.post(default_url_path + 'createproduct', jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productCtrl.createProduct);

  app.post(default_url_path + 'updateproduct', jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    productValidator.validateProduct, articleCtrl.updatearticle);
};

