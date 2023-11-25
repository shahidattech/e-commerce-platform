var path = require('path');
var syncCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'syncCtrl'));

module.exports = function(app) {
    default_url = '/datasync/';
    app.post(default_url + 'article', syncCtrl.articleIndex);   

};