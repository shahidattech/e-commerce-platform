var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initEventMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "eventModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                title: { type: "string", analyzer: "not_analyzed" },
                description_caption: { type: "string", index: "ngram_analyzer" }, //For filter exact match
                category_type_article: { type: "string", analyzer: "ngram_analyzer" }, //For partial match
                field_entity_profile_location: { type: "string", index: "not_analyzed" }
            }
        }
    }, cb);
}

exports.initEventMapping = initEventMapping;

exports.deleteEventIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "eventModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addEventDocumentV2 = function(param, callback) {
      //c//onsole.log(param.eventData._id, 'data');
    // console.log(param.eventData, 'data');
    if (check.isUndefinedOrNullOrEmpty(param.eventData))
        return callback();

    var document = {};
   console.log(param.eventData._id, 'data');
    if (!check.isUndefined(param.eventData.title)) {
        document.title = param.eventData.title;
    }
    if (!check.isUndefined(param.eventData.description_caption)) {
        document.description_caption = param.eventData.description_caption;
    }
    if (!check.isUndefined(param.eventData.category_type_article)) {
        document.category_type_article = param.eventData.category_type_article;
    }
    if (!check.isUndefined(param.eventData.field_entity_profile_location)) {
        document.field_entity_profile_location = param.eventData.field_entity_profile_location;
    }
    if (!check.isUndefined(param.eventData.files)) {
        document.files = param.eventData.files;
    }
    if (!check.isUndefined(param.eventData.field_event_date)) {
        document.field_event_date = param.eventData.field_event_date;
    }
    if (!check.isUndefined(param.eventData.field_event_date_to)) {
        document.field_event_date_to = param.eventData.field_event_date_to;
    }
    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "eventModelDocument",
                id: param.eventData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "eventModelDocument",
                id: param.eventData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};