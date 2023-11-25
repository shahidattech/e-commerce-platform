var path = require('path');
var articleCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'article', 'articleMasterCtrl'));
var jwt = require(path.join(__dirname, '..', '..', 'service', 'auth', 'jwt'));
var featureChecker = require(path.join(__dirname, '..', '..', 'service', 'auth', 'featureChecker'));

module.exports = function(app, upload) {
	//console.log(middleware)
   var default_url_path = '/api/v1/article/';
   app.post(default_url_path + 'createarticle',
             upload.fields([
            { name: 'uploadFiles', maxCount: 5 }, 
            { name: 'feature_image', maxCount: 5 },
            { name: 'paragraph_img', maxCount: 5 },
            { name: 'sliderImg', maxCount: 5 },
        ]), articleCtrl.createArticle);
    app.post(default_url_path + 'updatearticle', upload.fields([
            { name: 'uploadFiles', maxCount: 5 }, 
            { name: 'feature_image', maxCount: 5 },
            { name: 'paragraph_img', maxCount: 5 },
            { name: 'sliderImg', maxCount: 5 },
        ]), articleCtrl.updatearticle);    
    //  app.get(default_url_path + 'getarticle', articleCtrl.getArticle);
    // app.get(`${default_url_path}getTag`,tagCtrl.getTag)
    // app.post(`${default_url_path}addTag`,tagCtrl.addTag);
    app.get(default_url_path + 'getArticleByUserId/:userId', articleCtrl.getArticleByUserId);
    app.del(default_url_path + 'deleteArticle/:articleId', articleCtrl.deleteArticle);
    app.get(default_url_path + 'getArticleByArticleId/:articleId', articleCtrl.getArticleByArticleId);
    app.get(`${default_url_path}getArticle`,articleCtrl.getArticle);
    app.get(default_url_path + 'getArticleByCountry', articleCtrl.getArticleByCountry);
};

