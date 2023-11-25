var path = require('path');

var artistBasic = require(path.join(__dirname, 'admin', 'artistBasicCtrl'));
/* Article  Managment - Admin 
 * */
exports.createArtist = artistBasic.createArtist;
//exports.getArticle = artistBasic.getArticle;
exports.updateartists = artistBasic.updateartists;
exports.getArtists = artistBasic.getArtists;
exports.getArtistByArtistId = artistBasic.getArtistByArtistId;

