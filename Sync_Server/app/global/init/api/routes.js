/* global __dirname */
var path = require('path');
var elasticApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'elastic', 'elasticApi'));

module.exports = function(app) {
    elasticApi(app);
};