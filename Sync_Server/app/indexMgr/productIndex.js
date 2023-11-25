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
                _id: { type: "string" },
                createrId: { type: "string" },
                title: { type: "string", analyzer: "ngram_analyzer" },
                short_title: { type: "string", index: "not_analyzed" }, //For filter exact match
                main_category: { type: "string", index: "not_analyzed" },
                sub_category: { type: "string", index: "not_analyzed" },
                sub_sub_category: { type: "string", index: "not_analyzed" },
                // description: { type: "string", analyzer: "ngram_analyzer" }, //For partial match
                mainImage: { type: "string", index: "not_analyzed" }
            }
        }
    }, cb);
}

exports.initProductMapping = initProductMapping;

exports.addProductDocument = function (param, callback) {
    try {
        let isUpdate = true;
        if (isUpdate) {
            // console.log('param updating', param);
            param.es.create({
                index: param.indexName,
                type: "productModelDocument",
                id: param.productData._id.toString(),
                body: {
                    doc: param.productData
                }
            }, function (err, result) {
                if (err) {
                    console.log('err=', err);
                    callback(false);
                }
                else {
                    // console.log('Success', result);
                    callback(null,true);
                }
            });
        } else {
            param.es.index({
                index: param.indexName,
                type: "productModelDocument",
                id: param.productData._id.toString(),
                body: param.productData
            }, function (err, result) {
                if (err) {
                    callback(false);
                }
                else {
                    callback(null,true);
                }
            });
        }
    } catch (error) {
        console.log('Error', error);
        callback(false);
    }
}


exports.deleteProductIndex = function (param, cb) {
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

exports.deleteArticleIndex = function (param, cb) {
    param.es.delete({
        index: param.indexName,
        type: "articleModelDocument",
        id: param.id.toString()
    }, cb);
}