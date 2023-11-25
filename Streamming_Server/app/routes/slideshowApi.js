var path = require('path');
var slideShowCtrl = require(path.join(__dirname, '..', 'controller', 'slideShow', 'slideshowBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/slideshow/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'slideshow_carousel_images', maxCount: 5 }, 
            { name: 'uploadFiles', maxCount: 5 } 
           
        ]), slideShowCtrl.slideShowPhotos);    
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);

  app.post(default_url_path + 'updatePhoto', upload.fields([
    { name: 'slideshow_carousel_images', maxCount: 5 },
    { name: 'uploadFiles', maxCount: 5 }

  ]), slideShowCtrl.updatePhoto);

    app.delete(default_url_path + 'deleteimage', slideShowCtrl.deleteimage);

};

