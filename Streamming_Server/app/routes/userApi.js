/* global __dirname */
var path = require('path');
var uploadCtrl = require(path.join(__dirname, '..', 'controller', 'uploadCtrl'));
var msStreamCtrl = require(path.join(__dirname, '..', 'controller', 'miscFileDownloadCtrl'));
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
//var authentication = require(path.join(__dirname, '..', 'auth', 'authentication'));
//var authorize = require(path.join(__dirname, '..', 'auth', 'authorize'));

module.exports = function (app) {  
     
     app.post('/api/profile/removeprofilepicture', 
             //authentication.authenticateUser,
             //authorize.verifyProfilePicAccess,            
             msStreamCtrl.removeProfilePicture);   

     app.post('/api/profile/uploadprofilepicture',
             multipartyMiddleware, 
             //authentication.authenticateUser,             
             uploadCtrl.uploadProfilePicture);

    app.get('/api/profile/getprofilepicture', 
            msStreamCtrl.getProfilePicture);       
    
}