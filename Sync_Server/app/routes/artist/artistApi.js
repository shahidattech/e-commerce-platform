var path = require('path');
var artistCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'artist', 'artistBasicCtrl'));

module.exports = function(app) {

   var default_url_path = '/api/v1/artist/'
   app.post(default_url_path + 'createartist', artistCtrl.createArtist);
    app.get(default_url_path + 'getarticle', artistCtrl.getArticle);
}
