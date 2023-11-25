var path = require('path');
var syncCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'syncCtrl'));

module.exports = function (app) {
    var default_url_path = '/datasync/';

    app.post(default_url_path + 'product',
        syncCtrl.productIndex);

    app.post(default_url_path + 'deleteproduct',
        syncCtrl.removeProduct);










    // app.post(default_url_path + 'article',
    //     syncCtrl.articleIndex);

    // app.post(default_url_path + 'deletearticle',
    //     syncCtrl.removeArticle);

    // app.post(default_url_path + 'event',
    //     syncCtrl.eventIndexs);
    // app.post(default_url_path + 'deleteevent',
    //     syncCtrl.removeEvent);

    // app.post(default_url_path + 'venues',
    //     syncCtrl.venuesIndex);
    // app.post(default_url_path + 'deletevenues',
    //     syncCtrl.removeVenues);

    // app.post(default_url_path + 'artwork',
    //     syncCtrl.artworkIndex);
    // app.post(default_url_path + 'deleteartwork',
    //     syncCtrl.removeArtwork);

    // app.post(default_url_path + 'artist',
    //     syncCtrl.artistIndex);
    // app.post(default_url_path + 'deleteartist',
    //     syncCtrl.removeArtist);

    // app.post(default_url_path + 'slideshow',
    //     syncCtrl.slideshowIndex);
    // app.post(default_url_path + 'deleteslideshow',
    //     syncCtrl.removeSlideShow);

    // app.post(default_url_path + 'video',
    //     syncCtrl.videoIndex);

    // app.post(default_url_path + 'travel',
    //     syncCtrl.travelIndex);

};