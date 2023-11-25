var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initSlideshowMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "slideshowModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                title: { type: "string", analyzer: "ngram_analyzer" },
                description: { type: "string", index: "not_analyzed" }, //For filter exact match
                
            }
        }
    }, cb);
}

exports.initSlideshowMapping = initSlideshowMapping;

exports.deletePhotogalleryIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "slideshowModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addSlideshowDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.slideshowData))
        return callback();

    var document = {};
    console.log(param.slideshowData._id, 'slideshow data');
    if (!check.isUndefined(param.slideshowData.title)) {
        document.title = param.slideshowData.title;
    }
    if (!check.isUndefined(param.slideshowData.description)) {
        document.description = param.slideshowData.description;
    }
    if (!check.isUndefined(param.slideshowData.files)) {
        document.files = param.slideshowData.files;
    }
    if (!check.isUndefined(param.slideshowData.added_date)) {
        document.added_date = param.slideshowData.added_date;
    }
      if (!check.isUndefined(param.slideshowData.shortTitle)) {
        document.shortTitle = param.slideshowData.shortTitle;
    }
    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "slideshowModelDocument",
                id: param.slideshowData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "slideshowModelDocument",
                id: param.slideshowData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};

exports.deleteSlideShowIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "slideshowModelDocument",
        id: param.id.toString()
    }, cb);
}