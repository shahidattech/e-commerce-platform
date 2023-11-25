var _ = require('lodash');
var path = require('path');
var featureList = require(path.join(__dirname, 'featureList'));

var routesFeatureList = [
    //Article API
    { route: '/api/createarticle', feature: featureList.availableFeatures().WriteArticle }

];

exports.getRouteFeature = function(req) {
    return _.find(routesFeatureList, { route: req.route.path }).feature;
};