var path = require('path');
var trendCtrl = require(path.join(__dirname, '..', 'controller', 'trend', 'trendprofile'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/trend/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'main_trends_photos', maxCount: 50 }, 
           
           
        ]), trendCtrl.trendprofilePhotos);    
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
};

