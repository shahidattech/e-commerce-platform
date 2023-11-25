var path = require('path');
var UserCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'userAccount', 'userCtrl'));
var articleCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'article', 'articleMasterCtrl'));
var siteConfigCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'siteconfiguration', 'siteconfigMasterCtrl'));
// var jwt = require(Path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
// var Util = require(Path.join(__dirname, '..', '..', 'controllers', 'misc', 'utilCtrl'));
// var feature = require('../../service/auth/featureChecker');


module.exports = function(app){
    app.put(
        '/api/v1/update/:id', 
        //jwt.validateToken,
        UserCtrl.userUpdate
    );
    var default_url_path = '/api/v1/siteconfiguration/';
    app.get(`${default_url_path}getArticle`, siteConfigCtrl.getArticle);
    app.get(`${default_url_path}getSlideshow`, siteConfigCtrl.getSlideshow);
    app.get(default_url_path + 'getArticleByUserId/:country_abb', siteConfigCtrl.getArticleByUserId);
    app.get(default_url_path + 'getSlideshowByUserId/:userId', siteConfigCtrl.getSlideshowByUserId);
    app.get(default_url_path + 'getSlideshowByUserIdWeek/:userId', siteConfigCtrl.getSlideshowByUserIdWeek);
    app.get(default_url_path + 'getSlideshowByUserIdMonth/:userId', siteConfigCtrl.getSlideshowByUserIdMonth);
    app.post(default_url_path + 'createArticleCountryPos', siteConfigCtrl.createArticleCountryPos);
    app.get(default_url_path + 'getArticleByCountry', siteConfigCtrl.getArticleByCountry);
    app.put(`${default_url_path}updatePosition`,articleCtrl.updatePosition);
    app.post(default_url_path + 'createTrendingArticle', siteConfigCtrl.createTrendingArticle);
    app.post(default_url_path + 'topGlobalStories', siteConfigCtrl.topGlobalStories);
    app.post(default_url_path + 'features', siteConfigCtrl.features);
    app.put(default_url_path + 'updatearticle/:id', siteConfigCtrl.updatearticle); 
    app.del(default_url_path + 'deletetopGlobalStories/:articleId/:topGlobalStoriesID', siteConfigCtrl.deletetopGlobalStories);
    app.del(default_url_path + 'deleteSliders/:articleId/:SliderID', siteConfigCtrl.deleteSliders);
    app.del(default_url_path + 'deleteTrending/:articleId/:TreindingConfigId', siteConfigCtrl.trendingConfig);
    app.del(default_url_path + 'deleteFeatures/:articleId/:FeaturesID', siteConfigCtrl.FeaturesConfig);
    // app.post(default_url_path + 'updatePopulareSlideShows', siteConfigCtrl.updatePopulareSlideShows);
    // visual art, architecture, travle, lifestyle, fastion, performing arts
    app.post(default_url_path + 'updatevisualarts', siteConfigCtrl.UpdateVisualArts);
    //Most popular homepage article section and week month
   app.post(default_url_path + 'updatecurrentdate', siteConfigCtrl.UpdateCurrentDate);
 
     // app.post(`${default_url_path}Books`,articleCtrl.Books);
   //Home page most popular slide show
   app.post(default_url_path + 'popularSlideshowscurrentdate', siteConfigCtrl.popularSlideshowsCurrentDate);



};
