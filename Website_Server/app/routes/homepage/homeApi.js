var path = require('path');
var homeCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'home', 'homeMasterCtrl'));
var jwt = require(path.join(__dirname, "..", "..", "service", "auth", "jwt"));

module.exports = function(app) {
    var default_url_path = '/api/v1/website/home/';
    app.get(default_url_path + 'getHomeContent', homeCtrl.getHomePage);
    app.get(default_url_path + 'getHomeSlider', homeCtrl.getHomeSlider);
    app.get(default_url_path + 'getCatSubCatSubSub',homeCtrl.getCatSubCatSubSub);
}

