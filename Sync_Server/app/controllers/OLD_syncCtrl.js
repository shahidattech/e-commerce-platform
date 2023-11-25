var path = require('path');
// var mongo = require('mongoose');
var mongo = require(path.join(__dirname, '..', 'global', 'init', 'data', 'mongodb'));
var articleIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'articleIndex'));
var eventIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'eventIndex'));
var venuesIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'venuesIndex'));
var artworkIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'artworkIndex'));
var artistIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'artistIndex'));
var slideshowIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'slideshowIndex'));
var videoIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'videoIndex'));
var travelIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'travelIndex'));
var es = require(path.join(__dirname, '..', 'global', 'init', 'initEs'));
var ac = require(path.join(__dirname, '..', 'util', 'appConst'));
var async = require('async');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');
var restify = require('restify');

var productIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'productIndex'));

exports.productIndex = function(req, res) {
    var mng = mongo.getDb();
    var clsData = req.body;
    console.log(clsData)

    var document = {};

    async.waterfall([
        getProductDetails,
        createProductIndex,
    ], function(err, result) {
        if (err) {
            // return next(new restify.errors.InternalServerError(err));
            console.log('err', err);
        }

        // if (!goNext) {
        //     res.status(200);
        //     res.send(true);
        // } else
        //     goNext();
    });

    function getProductDetails(callback) {

        var productModel = mng.collection('products');
        
        if (!productModel) {
            callback('Db model is not available');
        }

        productModel
            .findOne({
                    _id: ObjectId(clsData.productId)
                }, {
                    fields: {
                        'title': 1,
                        'short_title': 1,
                        'description': 1,
                        'mainImage': 1,
                        'createrId': 1
                    }
                },
                function(err, productDetails) {
                    if (err) {
                        console.log('err', err);
                        callback(err);
                    }

                    // var document = {};

                    if (!productDetails) {
                        return callback(null, document);
                    }
                    console.log('productDetails=', productDetails);
                    document._id = productDetails._id;
                    document.title = productDetails.title;
                    document.short_title = productDetails.short_title;
                    document.description = productDetails.description;
                    document.createrId = productDetails.createrId;
                    console.log('document', document);
                    if(productDetails.mainImage && productDetails.mainImage.length > 0){
                        document.mainImage = productDetails.mainImage[0].location;
                    }

                    callback(null, document);
                });
    }

    function createProductIndex(productData, callback) {
        document._id = '603dfed2f36fc648262dffb3_1';
        document.title = 'productDetails.title';
        document.short_title = 'productDetails.short_title_1';
        document.description = 'productDetails.description';
        document.createrId = '6032bfec093058e44ec32ba0';
        document.mainImage = "https://mybrand-image-uploads.s3.ap-south-1.amazonaws.com/mainImage/mainImage_1614675666663_images.jpg";
        console.log('document', document);
        // clsData.title = 'test test';
        productIndxMgmt.addProductDocumentV2({
            // productData: clsData,
            productData: document,
            indexName: ac.indexes.productIndex,
            // indexName: 'productindex',
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {

                return callback(err);
            }
            console.log('response', response)
            callback(null, true);
        });
    }
};


exports.removeProduct = function(req, res, next) {
    productIndxMgmt.deleteProductIndex({
        indexName: ac.indexes.productIndex,
        id: req.body.productId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};


exports.articleIndex = function(req, res, next, goNext) {
    var mng = mongo.getDb();
    var clsData = req.body;
    console.log(clsData)
    async.waterfall([
        getArticleDetails,
        createArticleIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getArticleDetails(callback) {

        var articleModel = mng.collection('articlemodels');
        
        if (!articleModel) {
            callback('Db model is not available');
        }

        articleModel
            .findOne({
                    _id: ObjectId(clsData.articleId)
                }, {
                    fields: {
                        'articleId': 1,
                        'title': 1,
                        'short_title': 1,
                        'added_date':1,
                        'summary': 1,
                        'author_article': 1,
                        'category_type_article':1,
                        'files':1,
                    }
                },
                function(err, article) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!article) {
                        return callback(null, document);
                    }
                    console.log(article+ 'hello');
                    document._id = article._id;
                    document.title = article.title;
                    document.short_title = article.short_title;
                    document.summary = article.summary;
                    document.author_article = article.author_article;
                    document.files= article.files;
                    document.added_date =article.added_date;

                    callback(null, document);
                });
    }

    function createArticleIndex(articleData, callback) {
        articleIndxMgmt.addArticleDocumentV2({
            articleData: clsData,
            indexName: ac.indexes.articleIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.removeArticle = function(req, res, next) {
    articleIndxMgmt.deleteArticleIndex({
        indexName: ac.indexes.articleIndex,
        id: req.body.articleId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};

exports.removeArtist = function(req, res, next) {
    artistIndxMgmt.deleteArtistIndex({
        indexName: ac.indexes.artistIndex,
        id: req.body.artistId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};
exports.removeEvent = function(req, res, next) {
    eventIndxMgmt.deleteEventIndex({
        indexName: ac.indexes.eventIndex,
        id: req.body.eventId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};
exports.removeArtwork = function(req, res, next) {
    artworkIndxMgmt.deleteArtworkIndex({
        indexName: ac.indexes.artworkIndex,
        id: req.body.artworkId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};

exports.removeVenues = function(req, res, next) {
    venuesIndxMgmt.deleteVenuesIndex({
        indexName: ac.indexes.venuesIndex,
        id: req.body.venuesId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        res.status(200);
        res.send(true);
    });
};

exports.removeSlideShow = function(req, res, next) {
    console.log('removeSlideShow called req.body.slideShowId', req.body.slideShowId)
    slideshowIndxMgmt.deleteSlideShowIndex({
        indexName: ac.indexes.slideshowIndex,
        id: req.body.slideShowId,
        es: es.getElastic()
    }, function(err, response) {
        if (err) {
            console.log('removeSlideShow err', err)
            return next(new restify.errors.InternalServerError(err));
        }
        console.log('removeSlideShow success', response)
        res.status(200);
        res.send(true);
    });
};


exports.eventIndexs = function(req, res, next, goNext) {    
    var mng = mongo.getDb();
    var clsData = req.body;
    console.log(clsData);
    async.waterfall([
        getEventDetails,
        createEventIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getEventDetails(callback) {

        var eventModel = mng.collection('eventsmodels');
        
        if (!eventModel) {
            callback('Db model is not available');
        }

        eventModel
            .findOne({
                    _id: ObjectId(clsData._id)
                }, {
                    fields: {
                        '_id': 1,
                        'title': 1,
                        'description_caption': 1,
                        'category_type_article': 1,
                        'field_entity_profile_location': 1,
                        'files':1,
                        'field_event_date':1,
                        'field_event_date_to':1
                    }
                },
                function(err, event) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!event) {
                        return callback(null, document);
                    }else{
                        console.log(event._id, 'evetns data');
                    }
                    console.log(event);
                    document._id = event._id;
                    document.title = event.title;
                    document.description_caption = event.description_caption;
                    document.category_type_article = event.category_type_article;
                    document.field_entity_profile_location = event.field_entity_profile_location;
                    document.files= event.files;
                    document.field_event_date= event.field_event_date;
                    document.field_event_date_to= event.field_event_date_to;
                    callback(null, document);
                });
    }
    function createEventIndex(eventData, callback) {
      //  console.log(eventData, 'eventData callback');
        eventIndxMgmt.addEventDocumentV2({
            eventData: eventData,
            indexName: ac.indexes.eventIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.venuesIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getVenuesDetails,
        createVenuesIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getVenuesDetails(callback) {

        var venuesModel = mng.collection('entitylocationprofilemodels');
        
        if (!venuesModel) {
            callback('Db model is not available');
        }

        venuesModel
            .findOne({
                    _id: ObjectId(clsData.venuesId)
                }, {
                    fields: {
                        '_id': 1,
                        'entityName': 1,
                        'entityType': 1,
                        'locationName': 1,
                        'briefInfo':1,
                        'files':1,
                        'added_date':1,
                        'enitity_array_location':1
                    }
                },
                function(err, venues) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!venues) {
                        return callback(null, document);
                    }
                    console.log(venues);
                    document._id = venues._id;
                    document.entityName = venues.entityName;
                    document.entityType = venues.entityType;
                    document.locationName = venues.locationName;
                    document.briefInfo = venues.briefInfo;
                    document.files= venues.files;
                    document.added_date= venues.added_date;
                    document.enitity_array_location= venues.enitity_array_location;

                    callback(null, document);
                });
    }

    function createVenuesIndex(venuesData, callback) {

        venuesIndxMgmt.addVenuesDocumentV2({
            venuesData: venuesData,
            indexName: ac.indexes.venuesIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.artworkIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getArtworkDetails,
        createArtworkIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getArtworkDetails(callback) {

        var artworkModel = mng.collection('artworkmodels');
        
        if (!artworkModel) {
            callback('Db model is not available');
        }

        artworkModel
            .findOne({
                    _id: ObjectId(clsData.artworkId)
                }, {
                    fields: {
                        '_id': 1,
                        'title': 1,
                        'artworkType': 1,
                        'field_artists':1,
                        'extraDescription':1,
                        'files':1,
                        'added_date':1
                    }
                },
                function(err, artwork) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!artwork) {
                        return callback(null, document);
                    }
                    console.log(artwork);
                    document._id = artwork._id;
                    document.title = artwork.title;
                    document.files= artwork.files;
                    document.added_date = artwork.added_date;
                    document.field_artists = artwork.field_artists;

                    callback(null, document);
                });
    }

    function createArtworkIndex(artworkData, callback) {

        artworkIndxMgmt.addArtworkDocumentV2({
            artworkData: artworkData,
            indexName: ac.indexes.artworkIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.artistIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getArtistDetails,
        createArtistIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getArtistDetails(callback) {

        var artistModel = mng.collection('artistmodels');
        
        if (!artistModel) {
            callback('Db model is not available');
        }

        artistModel
            .findOne({
                    _id: ObjectId(clsData.artistId)
                }, {
                    fields: {
                        '_id': 1,
                        'artistName': 1,
                        'fname':1,
                        'files':1,
                        'lname':1,
                        'articleDescription':1,
                        //'biography': 1,
                        'nationality': 1,
                        'added_date':1,
                        'place_of_birth':1,
                        'place_of_death':1,
                    }
                },
                function(err, artist) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!artist) {
                        return callback(null, document);
                    }
                    console.log(artist);
                    document._id = artist._id;
                    document.artistName = artist.artistName;
                    document.fname = artist.fname;
                    document.files = artist.files;
                    document.lname = artist.lname;
                    document.articleDescription = artist.articleDescription;
                    document.nationality = artist.nationality;
                    document.added_date = artist.added_date;
                    document.place_of_birth = artist.place_of_birth;
                    document.place_of_death = artist.place_of_death;
                    callback(null, document);
                });
    }

    function createArtistIndex(artistData, callback) {

        artistIndxMgmt.addArtistDocumentV2({
            artistData: artistData,
            indexName: ac.indexes.artistIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.slideshowIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getSlideshowDetails,
        createSlideshowIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }
        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getSlideshowDetails(callback) {

        var slideShowModel = mng.collection('slideshowmodels');
        
        if (!slideShowModel) {
            callback('Db model is not available');
        }

        slideShowModel
            .findOne({
                    _id: ObjectId(clsData.slideshowId)
                }, {
                    fields: {
                        '_id': 1,
                        'title': 1,
                        'shortTitle':1,
                        'description': 1,
                        'files':1,
                        'added_date':1,
                    }
                },
                function(err, slideshow) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!slideshow) {
                        return callback(null, document);
                    }
                    console.log(slideshow);
                    document._id = slideshow._id;
                    document.title = slideshow.title;
                    document.description = slideshow.description;
                    document.files= slideshow.files;
                    document.added_date= slideshow.added_date;
                    document.shortTitle = slideshow.shortTitle;

                    callback(null, document);
                });
    }

    function createSlideshowIndex(slideshowData, callback) {

        slideshowIndxMgmt.addSlideshowDocumentV2({
            slideshowData: slideshowData,
            indexName: ac.indexes.slideshowIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.videoIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getVideoDetails,
        createVideoIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getVideoDetails(callback) {

        var videoModel = mng.collection('videomodels');
        
        if (!videoModel) {
            callback('Db model is not available');
        }

        videoModel
            .findOne({
                    _id: ObjectId(clsData.videoId)
                }, {
                    fields: {
                        '_id': 1,
                        'title': 1,
                        'description': 1
                    }
                },
                function(err, video) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!video) {
                        return callback(null, document);
                    }
                    console.log(video);
                    document._id = video._id;
                    document.title = video.title;
                    document.description = video.description;

                    callback(null, document);
                });
    }

    function createVideoIndex(videoData, callback) {

        videoIndxMgmt.addVideoDocumentV2({
            videoData: videoData,
            indexName: ac.indexes.videoIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};

exports.travelIndex = function(req, res, next, goNext) {    
    var clsData = req.body;
    var mng = mongo.getDb();
    console.log(clsData);
    async.waterfall([
        getTravelDetails,
        createTravelIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getTravelDetails(callback) {

        var travelModel = mng.collection('travelmodels');
        
        if (!travelModel) {
            callback('Db model is not available');
        }

        travelModel
            .findOne({
                    _id: ObjectId(clsData.travelId)
                }, {
                    fields: {
                        '_id': 1,
                        'destination': 1,
                        'entity_profile': 1
                    }
                },
                function(err, travel) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!travel) {
                        return callback(null, document);
                    }
                    console.log(travel);
                    document._id = travel._id;
                    document.destination = travel.destination;
                    document.entity_profile = travel.entity_profile;

                    callback(null, document);
                });
    }

    function createTravelIndex(travelData, callback) {

        travelIndxMgmt.addTravelDocumentV2({
            travelData: travelData,
            indexName: ac.indexes.travelIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};