
var path = require('path');
var uploadCtrl = require(path.join(__dirname, '..', 'controller', 'uploadCtrl'));
var msStreamCtrl = require(path.join(__dirname, '..', 'controller', 'miscFileDownloadCtrl'));
//var middleware = require(path.join(__dirname, '..', 'Middleware', 'CommonMiddleware'));

module.exports = function(app) {
	app.post('/api/uploads/',uploadCtrl.uploadProfilePicture);
    app.get('/api/class/getpicture',
        msStreamCtrl.getProfilePicture);
}