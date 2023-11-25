var path = require('path');
// var mongo = require('mongoose');
var mongo = require(path.join(__dirname, '..', 'global', 'init', 'data', 'mongodb'));
var articleIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'articleIndex'));
var es = require(path.join(__dirname, '..', 'global', 'init', 'initEs'));
var ac = require(path.join(__dirname, '..', 'util', 'appConst'));
var async = require('async');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');
var restify = require('restify');


exports.articleIndex = function(req, res, next, goNext) {   
    var mng = mongo.getDb(); 
    var clsData = req.body;
    console.log(clsData);
    async.waterfall([
        getArticleDetails,
        createArticleIndex,
    ], function(err, result) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }

        if (!goNext) {
            res.status(200);
            res.send(true);
        } else
            goNext();
    });

    function getArticleDetails(callback) {

        var articleModel = mng.collection('articlemodels');
        
        if (!articleModel) {
            callback('Db model is not available');
        }

        articleModel
            .findOne({
                    _id: ObjectId(clsData.articleId)
                }, {
                    fields: {
                        '_id': 1,
                        'title': 1,
                        'short_title': 1,
                        'summary': 1,
                        'author_article': 1
                    }
                },
                function(err, article) {
                    if (err) {
                        callback(err);
                    }

                    var document = {};

                    if (!article) {
                        return callback(null, document);
                    }
                    console.log(article);
                    document._id = article._id;
                    document.title = article.title;
                    document.short_title = article.short_title;
                    document.summary = article.summary;
                    document.author_article = article.author_article;

                    callback(null, document);
                });
    }

    function createArticleIndex(articleData, callback) {

        articleIndxMgmt.addArticleDocumentV2({
            articleData: articleData,
            indexName: ac.indexes.articleIndex,
            isUpdate: clsData.isUpdate,
            es: es.getElastic(),
            mongo: mng
        }, function(err, response) {
            if (err) {
                return callback(err);
            }

            callback(null, true);
        });
    }
};