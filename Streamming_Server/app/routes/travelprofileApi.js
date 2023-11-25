var path = require('path');
var travelprofileCtrl = require(path.join(__dirname, '..', 'controller', 'travelprofile', 'travelprofile'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/travelprofile/';
    app.post(default_url_path + 'travelphoto', upload.fields([
          
            { name: 'event_carousel_images', maxCount: 50 } 
        ]), travelprofileCtrl.travelprofilePhotos);    
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
};

