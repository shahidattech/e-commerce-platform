var path = require('path');
var slideShowCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'slideShow', 'slideShowBasicCtrl'));


module.exports = function(app, upload) {
	//console.log(middleware);
   var default_url_path = '/api/v1/slideShow/'
   app.post(default_url_path + 'createSlideShow',  upload.fields([
            { name: 'slideshow_carousel_images', maxCount: 50 }, 
            { name: 'uploadFiles', maxCount: 50 }]), slideShowCtrl.createSlideShow);
   app.post(`${default_url_path}updateSlideshow`,slideShowCtrl.updateSlideshow);
//    app.post(default_url_path + 'updatearticle', upload.fields([
//             { name: 'author_photos', maxCount: 5 }
//       ]), artistCtrl.updatearticle);  
   app.get(`${default_url_path}getSlideShowsByUserId/:userId`,slideShowCtrl.getSlideShowsByUserId);
   app.get(default_url_path + 'getslideshowWeek', slideShowCtrl.getSlideshowWeek);
   app.get(default_url_path + 'getslideshowcurrentDay', slideShowCtrl.getSlideshoCureentDay);
   app.get(default_url_path + 'getslideshowMonth', slideShowCtrl.getSlideshowMonth);
   app.get(`${default_url_path}getSlideShows`,slideShowCtrl.getSlideShows);
  app.get(`${default_url_path}getSlideShowsBySlideShowId/:slideShowId`,slideShowCtrl.getSlideShowsBySlideShowId);
}