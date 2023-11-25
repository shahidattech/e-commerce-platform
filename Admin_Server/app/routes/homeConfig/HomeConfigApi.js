var path = require('path');
var homeConfigCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'homeConfig', 'homeConfigBasicCtrl'));
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/homePageConfig/'

  app.post(default_url_path + 'saveHomeConfig',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    homeConfigCtrl.saveHomeConfig);

  app.post(default_url_path + 'getHomeConfig',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    homeConfigCtrl.getHomeConfigByUserId);

  app.post(default_url_path + 'saveHomeConfigTheme2',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    homeConfigCtrl.saveHomeConfigTheme2);

  app.post(default_url_path + 'getHomeConfigTheme2',
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    homeConfigCtrl.getHomeConfigTheme2ByUserId);
}
