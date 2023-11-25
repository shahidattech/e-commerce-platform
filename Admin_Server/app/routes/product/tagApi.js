var path = require('path');
var tagsCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'product', 'tagMasterCtrl'));
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/tags/';
  app.post(default_url_path + 'addTag',tagsCtrl.addTag);
  app.get(default_url_path + 'getTag',tagsCtrl.getTag);
};

