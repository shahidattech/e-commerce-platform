var path = require('path');
var tagCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'article', 'tagMasterCtrl'));
//var artistCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'artist', 'artistBasicCtrl'));

module.exports = function(app) {
	//console.log(middleware);
   var default_url_path = '/api/v1/tags/'
   app.post(default_url_path + 'addTag', tagCtrl.addTag);
   //app.get(default_url_path + 'getarticle', );
   app.get(default_url_path + 'getTag', tagCtrl.getTag)
      
}