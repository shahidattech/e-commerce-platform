var path = require('path');
var entityProfileLocationCtrl = require('../controller/entityProfileLocation/entityProfileLocationCtrl');

module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/entityProfileLocation/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'location_photos', maxCount: 1 }, 
           
        ]), entityProfileLocationCtrl.entityProfileLocationPhoto);
  // app.post(default_url_path + 'updatePhoto', upload.fields([
  //   { name: 'location_photos', maxCount: 2 },

  // ]), entityProfileLocationCtrl.updatePhoto);
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);

    app.delete(default_url_path + 'deleteimage', entityProfileLocationCtrl.deleteimage);
};