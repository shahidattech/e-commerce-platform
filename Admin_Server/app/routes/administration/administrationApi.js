var path = require('path');
var aministrationCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'administration', 'administrationMaster'));

module.exports = function(app) {

   var default_url_path = '/api/v1/administration/'
   app.post(default_url_path + 'useractive', aministrationCtrl.administrationUsers);
  // app.get(default_url_path + 'getauthor', authorCtrl.getAuthor);
}

