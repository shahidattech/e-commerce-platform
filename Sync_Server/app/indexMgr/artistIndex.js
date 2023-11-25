var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initArtistMapping(param, cb) { 
    param.es.indices.putMapping({
        index: param.indexName,
        type: "artistModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                artistName: { type: "string", analyzer: "not_analyzed" },
                fname: { type: "string", analyzer: "not_analyzed" },
                lname: { type: "string", analyzer: "not_analyzed" },
                articleDescription: { type: "string", analyzer: "ngram_analyzer" },
                // biography: { type: "string", index: "not_analyzed" }, //For filter exact match
                nationality: { type: "string", analyzer: "ngram_analyzer" }, //For partial match
            }
        }
    }, cb);
}

exports.initArtistMapping = initArtistMapping;

exports.deleteArtistIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "artistModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addArtistDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.artistData))
        return callback();

    var document = {};
    console.log(param.artistData._id, 'artist data');
    if (!check.isUndefined(param.artistData.name)) {
        document.name = param.artistData.name;
    }
    if (!check.isUndefined(param.artistData.artistName)) {
        document.artistName = param.artistData.artistName;
    }
    if (!check.isUndefined(param.artistData.nationality)) {
        document.nationality = param.artistData.nationality;
    }

    if (!check.isUndefined(param.artistData.fname)) {
        document.fname = param.artistData.fname;
    }
    if (!check.isUndefined(param.artistData.lname)) {
        document.lname = param.artistData.lname;
    }
    if (!check.isUndefined(param.artistData.articleDescription)) {
        document.articleDescription = param.artistData.articleDescription;
    }
    if (!check.isUndefined(param.artistData.files)) {
        document.files = param.artistData.files;
    }
    if (!check.isUndefined(param.artistData.added_date)) {
        document.added_date = param.artistData.added_date;
    }
    if (!check.isUndefined(param.artistData.place_of_birth)) {
        document.place_of_birth = param.artistData.place_of_birth;
    }
    if (!check.isUndefined(param.artistData.place_of_death)) {
        document.place_of_death = param.artistData.place_of_death;
    }

    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "artistModelDocument",
                id: param.artistData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "artistModelDocument",
                id: param.artistData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};