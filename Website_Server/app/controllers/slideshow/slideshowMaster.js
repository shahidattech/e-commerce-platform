var path = require('path');

var slideshowBasic = require(path.join(__dirname, 'admin', 'slideshowBasicCtrl'));
exports.getSlideshow = slideshowBasic.getSlideshow;
exports.getSlideshowById = slideshowBasic.getSlideshowById;
exports.getslideshowByCountry = slideshowBasic.getslideshowByCountry;
exports.getslideshowSelectCategory = slideshowBasic.getslideshowSelectCategory;
exports.getSlideshowByCategory = slideshowBasic.getSlideshowByCategory;
exports.getSlideshowByCategoryArchitecture = slideshowBasic.getSlideshowByCategoryArchitecture;
exports.getSlideshowByCategoryPerformingArts = slideshowBasic.getSlideshowByCategoryPerformingArts;
exports.getSlideshowByCategoryLifestyle = slideshowBasic.getSlideshowByCategoryLifestyle;
exports.getSlideshowByCategoryFashion = slideshowBasic.getSlideshowByCategoryFashion;



