var path = require('path');
var usersCtrl = require(path.join(__dirname, '..', 'controller', 'users', 'userBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/users/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'user_photos', maxCount: 1 }, 
           
        ]), usersCtrl.usresPhotos);    
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
};

