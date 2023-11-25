var path = require('path');
var slideShowCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'sliders', 'slidersBasicCtrl'));
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');

module.exports = function (app, upload) {
  //console.log(middleware);
  var default_url_path = '/api/v1/slider/'

  app.post(default_url_path + 'createSlider',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.createSlider
  );

  app.post(`${default_url_path}list`,
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.listSlider
  );

  app.post(`${default_url_path}deleteSlider`,
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    slideShowCtrl.deleteSlider
  );

}
