var path = require('path');
var _ = require('lodash-node');
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));

function initProductMapping(param, cb) {
    param.es.indices.putMapping({
        index: param.indexName,
        type: "productModelDocument",
        _id: { path: "post_id" },
        body: {
            properties: {
                post_id: { type: "string" },
                title: { type: "string", analyzer: "ngram_analyzer" },
                short_title: { type: "string", index: "not_analyzed" }, //For filter exact match
                description: { type: "string", analyzer: "ngram_analyzer" }, //For partial match
                createrId: { type: "string", index: "not_analyzed" },
                mainImage: { type: "string", index: "not_analyzed" }
            }
        }
    }, cb);
}

exports.initProductMapping = initProductMapping;

exports.addProductDocumentV2 = function(param, callback) {
    if (check.isUndefinedOrNullOrEmpty(param.productData))
        return callback();
    console.log('param', param);
    var document = {};
    if (!check.isUndefined(param.productData.title)) {
        document.title = param.productData.title;
    }
    if (!check.isUndefined(param.productData.short_title)) {
        document.short_title = param.productData.short_title;
    }
    if (!check.isUndefined(param.productData.description)) {
        document.description = param.productData.description;
    }
    if (!check.isUndefined(param.productData.mainImage)) {
        document.mainImage = param.productData.mainImage;
    }

    if (!check.isUndefined(param.productData.createrId)) {
        document.createrId = param.productData.createrId;
    }

    if (!check.isUndefinedOrEmpty(document)) {
        // console.log(param.productData._id, 'ffffffffffffff');
        if (param.isUpdate) {
            param.es.create({
                index: param.indexName,
                type: "productModelDocument",
                id: param.productData._id.toString(),
                body: {
                    doc: document
                }
            }, callback);
        } else {
            param.es.index({
                index: param.indexName,
                type: "productModelDocument",
                id: param.productData._id.toString(),
                body: document
            }, callback);

        }
    } else
        callback();
};

exports.deleteProductIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "productModelDocument",
        id: param.id.toString()
    }, cb);
}

/*exports.deleteArticleIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "articleModelDocument",
        id: param.id.toString()
    }, cb);
};*/

exports.deleteArticleIndex = function(param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "articleModelDocument",
        id: param.id.toString()
    }, cb);
}