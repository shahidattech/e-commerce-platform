/* global __dirname */
var Path = require('path');

var UserCtrl = require(Path.join(__dirname, '..', '..', 'controllers', 'userAccount', 'userCtrl'));
var UserVld = require(Path.join(__dirname, '..', '..', 'validation', 'controller', 'userCtrlVld'));
var jwt = require(Path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
// var Util = require(Path.join(__dirname, '..', '..', 'controllers', 'misc', 'utilCtrl'));

module.exports = function(app){
	app.post('/api/user',
        // UserVld.verifyCreateUser,
        UserCtrl.existsUser,
        // emailCtrl.sendAccountVerify,
        UserCtrl.createUser
        // message.setInitialMessages
    );

    app.get('/api/user/:id/userinfo', UserCtrl.getProfileInfo);

    // get user details 
    app.post(
        '/api/users/getByIds', 
        UserCtrl.getUsersByIds
    );

    // update user details 
    app.post(
        '/api/users/update', 
        jwt.validateToken,
        UserCtrl.updateUserProfile
    );
    app.post(
        '/api/user/updatePassword', 
        jwt.validateToken,
        UserVld.verifyChangePassword,
        UserCtrl.updateUserPassword
    );
    app.post(
        '/api/user/updateAvatar', 
        jwt.validateToken,            
        UserCtrl.updateAvatar
    );


    // search users 
    app.get(
        '/api/user/search/:searchText', 
        UserCtrl.getUsers
    );

    //get all users Except One By Id
    app.get(
        '/api/user/:id/getallusersexceptbyid', 
        UserCtrl.getAllUsersExceptOneById
    );
    
    
}