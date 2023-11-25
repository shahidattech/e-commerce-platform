var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initVideoMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "videoModelDocument",
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

exports.initVideoMapping = initVideoMapping;

exports.deleteVideoIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "videoModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addVideoDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.videoData))
        return callback();

    var document = {};
    console.log(param.videoData);
    if (!check.isUndefined(param.videoData.title)) {
        document.title = param.videoData.title;
    }
    if (!check.isUndefined(param.videoData.description)) {
        document.name = param.videoData.description;
    }
    
    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "videoModelDocument",
                id: param.videoData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "videoModelDocument",
                id: param.videoData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};