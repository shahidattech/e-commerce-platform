var path = require('path');
var artistCtrl = require(path.join(__dirname, '..', 'controller', 'artists', 'artistBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/artist/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'author_photos', maxCount: 1 }, 
           
        ]), artistCtrl.artistPhotos);
  app.post(default_url_path + 'photoUpdate', upload.fields([
    { name: 'author_photos', maxCount: 1 },

  ]), artistCtrl.updatePhoto);
  // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
  app.delete(default_url_path + 'deleteimage', artistCtrl.deleteimage);

};

