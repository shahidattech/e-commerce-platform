var path = require('path');
var productCtrl = require(path.join(__dirname, '..', 'controller', 'product', 'productBasicCtrl'));

module.exports = function(app, upload) {
    var default_url_path = '/api/v1/media/product/';
    app.post(default_url_path + 'uploadProductImages', upload.fields([
            { name: 'mainImage', maxCount: 1},
            { name: 'otherImages', maxCount: 5},
            // { name: 'uploadFiles', maxCount: 10 }, 
            // { name: 'feature_image', maxCount: 5 },
            // { name: 'paragraph_img', maxCount: 5 },
            // { name: 'sliderImg', maxCount: 15 },
        ], 'file'), productCtrl.updateproduct);

    app.post(default_url_path + 'uploadstoreLogo', upload.fields([
        { name: 'logoImage', maxCount: 1},
    ], 'file'), productCtrl.updateLogo);
    
    app.post(default_url_path + 'uploadProductImagesReturnData', upload.fields([
        { name: 'mainImage', maxCount: 1},
        { name: 'otherImages', maxCount: 5}
    ], 'file'), productCtrl.updateproductReturnData);
};

