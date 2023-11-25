var path = require('path');
var travelcityCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'travel-city', 'travelcityMaster'));

module.exports = function(app, upload) {

   var default_url_path = '/api/v1/travel/'
   app.post(default_url_path + 'travelcity', upload.fields([
            { name: 'top_image_1', maxCount: 50 },
            { name: 'Wide_Images', maxCount: 50 },
            { name: 'top_image_2', maxCount: 50 }, 
            { name: 'top_image_3', maxCount: 50 }, 
        ]), travelcityCtrl.travelcityUsers);
  // app.get(default_url_path + 'getauthor', authorCtrl.getAuthor);
}

