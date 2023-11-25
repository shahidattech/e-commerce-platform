var path = require('path');
var articleCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'article', 'articleMasterCtrl'));

module.exports = function(app, upload) {
	//console.log(middleware)
   var default_url_path = '/api/v1/article/';
   app.post(default_url_path + 'createarticle', upload.fields([
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
	app.get(default_url_path + 'getarticle', articleCtrl.getArticle);
	 	var articleCtrls = require(path.join(__dirname,'..', '..','controllers', 'file.controller'));
   }

