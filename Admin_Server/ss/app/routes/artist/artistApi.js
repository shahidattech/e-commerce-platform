var path = require('path');
var artistCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'artist', 'artistMasterCtrl'));


module.exports = function(app, upload) {
	//console.log(middleware);
   var default_url_path = '/api/v1/artist/'
   app.post(default_url_path + 'createartist', upload.fields([
            { name: 'author_photos', maxCount: 1 },   
        ]), artistCtrl.createArtist);
   //app.get(default_url_path + 'getarticle', artistCtrl.getArtists);
   app.post(default_url_path + 'updateartists', artistCtrl.updateartists);
   app.get(default_url_path + 'getartists', artistCtrl.getArtists);

   app.get(`${default_url_path}getArtistByArtistId/:artistId`,artistCtrl.getArtistByArtistId)
}
