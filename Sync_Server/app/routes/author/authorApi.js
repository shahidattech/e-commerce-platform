var path = require('path');
var authorCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'article', 'authorMasterCtrl'));

module.exports = function(app) {

   var default_url_path = '/api/v1/author/'
   app.post(default_url_path + 'createauthor', authorCtrl.createAuthor);
   app.get(default_url_path + 'getauthor', authorCtrl.getAuthor);
}

