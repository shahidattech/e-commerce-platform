var path = require('path');
var sliderShowCtrl = require(path.join(__dirname, '..', 'controller', 'slider', 'sliderBasicCtrl'));

module.exports = function (app, upload) {
  var default_url_path = '/api/v1/media/slider/';
  app.post(default_url_path + 'photo', upload.fields([
    { name: 'sliderImg', maxCount: 1 }

  ]), sliderShowCtrl.sliderPhoto);

};

