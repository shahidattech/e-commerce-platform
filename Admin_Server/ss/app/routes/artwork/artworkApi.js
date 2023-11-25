var path = require('path');
var artworkCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'artwork', 'artworkBasicCtrl'));

var artworksCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'artwork', 'admin', 'artworkBasicCtrl'));


module.exports = function(app, upload) {
	//console.log(middleware);
   var default_url_path = '/api/v1/artwork/'
   app.post(default_url_path + 'createArtwok',upload.fields([
           { name: 'artwork_photos', maxCount: 5 }]), artworkCtrl.createArtwork);
   app.get(default_url_path + 'getartwork', artworksCtrl.getartwork);
   app.get(`${default_url_path}getArtworkByUserId/:userId`,artworksCtrl.getArtworkByUserId);
   app.get(`${default_url_path}getArtworkByArtworkId/:artworkId`,artworksCtrl.getArtworkByArtworkId)
   app.post(`${default_url_path}updateArtwork`,artworksCtrl.updateArtwork);
//    app.post(default_url_path + 'updatearticle', upload.fields([
//             { name: 'author_photos', maxCount: 5 }
//       ]), artistCtrl.updatearticle);  
   
    app.del(default_url_path + 'deleteArtwork/:artworkId', artworksCtrl.deleteArtwork);
}