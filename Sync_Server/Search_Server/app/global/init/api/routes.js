/* global __dirname */
var path = require('path');
var elasticApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'elastic', 'elasticApi'));
var searchApi = require(path.join(__dirname, '..', '..', '..', 'routes', 'elasticSearch', 'searchApi'));

module.exports = function(app) {
//console.log(middleware)
    elasticApi(app);
    searchApi(app);
};