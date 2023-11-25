var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initTravelMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "travelModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                destination: { type: "string", analyzer: "ngram_analyzer" },
                entity_profile: { type: "string", index: "not_analyzed" }, //For filter exact match
                
            }
        }
    }, cb);
}

exports.initTravelMapping = initTravelMapping;

exports.deleteTravelIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "travelModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addTravelDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.travelData))
        return callback();

    var document = {};
    console.log(param.travelData);
    if (!check.isUndefined(param.travelData.destination)) {
        document.destination = param.artworkData.destination;
    }
    if (!check.isUndefined(param.travelData.entity_profile)) {
        document.entity_profile = param.travelData.entity_profile;
    }
    
    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "travelModelDocument",
                id: param.travelData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "travelModelDocument",
                id: param.travelData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};