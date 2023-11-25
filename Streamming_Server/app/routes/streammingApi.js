var path = require('path');
var uploadCtrl = require(path.join(__dirname, '..', 'controller', 'uploadCtrl'));
var avStreamCtrl = require(path.join(__dirname, '..', 'controller', 'avStreamCtrl'));
var msStreamCtrl = require(path.join(__dirname, '..', 'controller', 'miscFileDownloadCtrl'));
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var authentication = require(path.join(__dirname, '..', 'auth', 'authentication'));
var authorize = require(path.join(__dirname, '..', 'auth', 'authorize'));
var awsVideoCtrl = require(path.join(__dirname, '..', 'controller', 'awsVideoCtrl'));
var uploadCtrl = require(path.join(__dirname, '..', 'controller', 'uploadCtrl'));

module.exports = function(app) {
    // app.post('/api/uploads/',uploadCtrl.uploadProfilePicture1);

    app.get('/api/v1/media/resource/downloadfile',  
    //app.get('/api/resource/downloadfile',
        // authentication.authenticateUser,
        msStreamCtrl.downloadFile);
}