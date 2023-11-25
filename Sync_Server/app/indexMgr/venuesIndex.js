var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initVenuesMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "venuesModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                entityName: { type: "string", analyzer: "ngram_analyzer" },
                entityType: { type: "string", index: "not_analyzed" }, //For filter exact match
                locationName: { type: "string", index: "not_analyzed" },
                briefInfo: { type: "string", analyzer: "ngram_analyzer" },
            }
        }
    }, cb);
}

exports.initVenuesMapping = initVenuesMapping;

exports.deleteVenuesIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "venuesModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addVenuesDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.venuesData))
        return callback();

    var document = {};
    console.log(param.venuesData._id);
    if (!check.isUndefined(param.venuesData.entityName)) {
        document.entityName = param.venuesData.entityName;
    }
    if (!check.isUndefined(param.venuesData.entityType)) {
        document.entityType = param.venuesData.entityType;
    }
    if (!check.isUndefined(param.venuesData.locationName)) {
        document.locationName = param.venuesData.locationName;
    }
    if (!check.isUndefined(param.venuesData.briefInfo)) {
        document.briefInfo = param.venuesData.briefInfo;
    }
    if (!check.isUndefined(param.venuesData.files)) {
        document.files = param.venuesData.files;
    }
    if (!check.isUndefined(param.venuesData.added_date)) {
        document.added_date = param.venuesData.added_date;
    }
    if (!check.isUndefined(param.venuesData.enitity_array_location)) {
        document.enitity_array_location = param.venuesData.enitity_array_location;
    }

    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "venuesModelDocument",
                id: param.venuesData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "venuesModelDocument",
                id: param.venuesData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};