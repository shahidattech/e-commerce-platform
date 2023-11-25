var path = require('path');
var articleCtrl = require(path.join(__dirname, '..', 'controller', 'article', 'articleBasicCtrl'));

// var articleCtrls = require(path.join(__dirname,'..','controller', 'file.controller'));
module.exports = function(app, upload) {
    //console.log(middleware)
    var default_url_path = '/api/v1/media/article/';
    app.post(default_url_path + 'updatearticle', upload.fields([
            { name: 'uploadFiles', maxCount: 10 }, 
            { name: 'feature_image', maxCount: 5 },
            { name: 'paragraph_img', maxCount: 5 },
            { name: 'sliderImg', maxCount: 15 },
        ], 'file'), articleCtrl.updatearticle);
  app.post(default_url_path + 'updatearticlePhoto', upload.fields([
    { name: 'uploadFiles', maxCount: 10 },
    { name: 'feature_image', maxCount: 5 },
    { name: 'paragraph_img', maxCount: 5 },
    { name: 'sliderImg', maxCount: 15 },
  ]), articleCtrl.updatePhoto);
  // app.post('/api/files/upload', upload.fields([{name:"uploadfile",maxCounts:10},{name:"deomuploads", maxCounts:5}]), articleCtrls.uploadFile);
    app.delete(default_url_path + 'deleteimage', articleCtrl.deleteimage);
};

