var path = require('path');
var slideShowCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'slideShow', 'slideShowBasicCtrl'));
var slideShowValidator = require('../../validation/controller/slideShowVald');
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/slideShow/'
  app.post(default_url_path + 'createSlideShow',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.createSlideShow

  );
  app.post(`${default_url_path}list`,
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.listSlideShow
  );

  app.post(`${default_url_path}deleteSlideShow`,
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.deleteSlideShow
  );
}
