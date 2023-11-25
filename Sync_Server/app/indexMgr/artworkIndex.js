var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initArtworkMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "artworkModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                title: { type: "string", analyzer: "not_analyzed" },
                artworkType: { type: "string", index: "ngram_analyzer" }, //For filter exact match
                extraDescription: { type: "string", analyzer: "ngram_analyzer" },
                
            }
        }
    }, cb);
}

exports.initArtworkMapping = initArtworkMapping;

exports.deleteArtworkIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "artworkModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addArtworkDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.artworkData))
        return callback();

    var document = {};
    console.log(param.artworkData._id);
    if (!check.isUndefined(param.artworkData.title)) {
        document.title = param.artworkData.title;
    }
    if (!check.isUndefined(param.artworkData.files)) {
        document.files = param.artworkData.files;
    }
     if (!check.isUndefined(param.artworkData.added_date)) {
        document.added_date = param.artworkData.added_date;
    }
    if (!check.isUndefined(param.artworkData.field_artists)) {
        document.field_artists = param.artworkData.field_artists;
    }
    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "artworkModelDocument",
                id: param.artworkData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "artworkModelDocument",
                id: param.artworkData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};