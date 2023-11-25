var path = require('path');
var travelprofileCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'travelprofile', 'travelprofileMaster'));

module.exports = function(app, upload) {

   var default_url_path = '/api/v1/travel/'
   app.post(default_url_path + 'travelprofile', upload.fields([
            { name: 'event_carousel_images', maxCount: 50 } 
        ]), travelprofileCtrl.travelprofileUsers);
  // app.get(default_url_path + 'getauthor', authorCtrl.getAuthor);
}

