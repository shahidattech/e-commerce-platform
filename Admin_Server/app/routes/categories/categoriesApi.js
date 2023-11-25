var path = require('path');
var categoriesCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'categories', 'categoriesMasterCtrl'));

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/categories/';
  app.get(default_url_path + 'getCategories',
    categoriesCtrl.getCategories);
    var default_url_path = '/api/v1/categories/';
};

