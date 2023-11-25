var path = require('path');
var artworkCtrl = require(path.join(__dirname, '..', 'controller', 'artwork', 'artworkBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/artwork/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'artwork_photos', maxCount: 5 }, 
           
        ]), artworkCtrl.artworkPhotos);
  app.post(default_url_path + 'updatePhoto', upload.fields([
    { name: 'artwork_photos', maxCount: 5 },

  ]), artworkCtrl.updatePhoto);
  // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
   app.delete(default_url_path + 'deleteimage', artworkCtrl.deleteimage);
};

