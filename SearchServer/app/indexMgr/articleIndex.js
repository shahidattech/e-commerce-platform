var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initArticleMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "articleModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                title: { type: "string", analyzer: "ngram_analyzer" },
                short_title: { type: "string", index: "not_analyzed" }, //For filter exact match
                summary: { type: "string", analyzer: "ngram_analyzer" }, //For partial match
                author_article: { type: "string", index: "not_analyzed" }
            }
        }
    }, cb);
}

exports.initArticleMapping = initArticleMapping;

exports.deleteArticleIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "articleModelDocument",
        id: param.id.toString()
    }, cb);
};

exports.addArticleDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.articleData))
        return callback();

    var document = {};
    console.log(param.articleData);
    if (!check.isUndefined(param.articleData.title)) {
        document.title = param.articleData.title;
    }
    if (!check.isUndefined(param.articleData.short_title)) {
        document.short_title = param.articleData.short_title;
    }
    if (!check.isUndefined(param.articleData.summary)) {
        document.summary = param.articleData.summary;
    }
    if (!check.isUndefined(param.articleData.author_article)) {
        document.author_article = param.articleData.author_article;
    }

    if (!check.isUndefinedOrEmpty(document)) {
        if (param.isUpdate) {
            param.es.update({
                index: param.indexName,
                type: "articleModelDocument",
                id: param.articleData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "articleModelDocument",
                id: param.articleData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};