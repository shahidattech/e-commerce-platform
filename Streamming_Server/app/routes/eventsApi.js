var path = require('path');
var eventCtrl = require(path.join(__dirname, '..', 'controller', 'events', 'eventsBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/event/';
    app.post(default_url_path + 'photo', upload.fields([
            { name: 'main_events_photos', maxCount: 5 }, 
            { name: 'event_carousel_images', maxCount: 5 },
            { name: 'press_release', maxCount: 5 }, 
           
        ]), eventCtrl.eventPhotos);
  app.post(default_url_path + 'updatePhoto', upload.fields([
    { name: 'main_events_photos', maxCount: 5 },
    { name: 'event_carousel_images', maxCount: 5 },
    { name: 'press_release', maxCount: 5 },

  ]), eventCtrl.updatePhoto);
   
    // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
    app.delete(default_url_path + 'deleteimage', eventCtrl.deleteimage);

};

