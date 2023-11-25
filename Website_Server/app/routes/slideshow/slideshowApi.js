var path = require('path');
var slideshowCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'slideshow', 'slideshowMaster'));
module.exports = function(app) {
    var default_url_path = '/api/v1/website/slideshow/';
    app.get(default_url_path + 'getslideshow', slideshowCtrl.getSlideshow);
    app.get(default_url_path + 'getslideshowbycategory', slideshowCtrl.getSlideshowByCategory);
    app.get(default_url_path + 'getslideshowbycategorybyarchitecture', slideshowCtrl.getSlideshowByCategoryArchitecture);
    app.get(default_url_path + 'getslideshowbycategorybyperformingArts', slideshowCtrl.getSlideshowByCategoryPerformingArts);
    app.get(default_url_path + 'getslideshowById/:slideshowId', slideshowCtrl.getSlideshowById);
    // app.get(default_url_path + 'getarticleByArtistId', articleCtrl.getArticleByArtistId);
    // app.get(default_url_path + 'getarticleByAuthorId', articleCtrl.getArticleByAuthorId);
     app.get(default_url_path + 'getslideshowSelectCategory', slideshowCtrl.getslideshowSelectCategory);
    // app.get(default_url_path + 'getarticleByCountry', articleCtrl.getarticleByCountry);
    app.get(default_url_path + 'getslideshowByCountry', slideshowCtrl.getslideshowByCountry);
    app.get(default_url_path + 'getslideshowbycategorybylifestyle', slideshowCtrl.getSlideshowByCategoryLifestyle);
    app.get(default_url_path + 'getslideshowbycategorybyfashion', slideshowCtrl.getSlideshowByCategoryFashion);
  
}

