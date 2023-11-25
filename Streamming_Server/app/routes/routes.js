/* global __dirname */
var path = require('path');
var mediaApi = require(path.join(__dirname, 'mediaApi'));

module.exports = function(app) {
    //media/resources routes
    mediaApi(app);
};