var path = require('path');
var travelcityCtrl = require(path.join(__dirname, '..', 'controller', 'travelcity', 'travelcityBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/travelcity/';
    app.post(default_url_path + 'travelphoto', upload.fields([
          
            { name: 'top_image_1', maxCount: 50 },
            { name: 'Wide_Images', maxCount: 50 },
            { name: 'top_image_2', maxCount: 50 }, 
            { name: 'top_image_3', maxCount: 50 }, 
        ]), travelcityCtrl.travelcityPhotos);    
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
};

