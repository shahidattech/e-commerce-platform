var path = require('path');
var async = require('async');
var _ = require('lodash-node');
var restify = require('restify');
var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));
var productIndex = require(path.join(__dirname, '..', 'search', 'productIndex'));
var check = require(path.join(__dirname, '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
var es = require(path.join(__dirname, '..', 'global', 'init', 'initEs'));

exports.productkeywordsSearch = function (req, res, next) {
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var postParam = params;
    let productkeywordsSearch_resp = {};
    if (!check.isUndefinedOrNullOrEmptyOrNoLen(postParam.term) && !check.isUndefinedOrNullOrEmptyOrNoLen(params.userId)) {
        var indexNameProduct = appConst.indexNames.productIndex;
        console.log('postParam', postParam);
        productIndex.getProductSearchResults(postParam, indexNameProduct,
            function (err, result) {
                if (err) {
                    return next(new restify.errors.InternalServerError(err, 'error'));
                    res.status(500);
                    console.log('error 24', err);
                    productkeywordsSearch_resp.status = 500;
                    productkeywordsSearch_resp.data = "Internal Server Error"
                    res.send(productkeywordsSearch_resp);
                }
                else{
                    var searchResultItems = _.sortByOrder(result.data, ['_score'], ['desc']);
                    var aggData = result.agg;
                    if (postParam.isAutoSuggest) {
                        searchResultItems = removeDuplicates(searchResultItems);
                    }
                    productkeywordsSearch_resp.status = 200;
                    productkeywordsSearch_resp.data = searchResultItems;
                    res.status(200);
                    // res.send(productkeywordsSearch_resp);
                    res.send(searchResultItems);
                    next();
                }
            });
    }
    else{
        productkeywordsSearch_resp.status = 400;
        productkeywordsSearch_resp.data = "Please enter your search Keyword";
        res.status(400);
        res.send(productkeywordsSearch_resp);
    }
};

function removeDuplicates(results) {
    var filteredResults = [];

    for (var index = 0; index < results.length; index++) {
        var rs = results[index]._source;

        if (filteredResults.length > 0) {
            var foundDuplicate = _.find(filteredResults, function (frs) {

                return frs.title == rs.title &&
                    frs._id == rs._id &&
                    frs.category_type_article == rs.category_type_article &&
                    frs.short_title == rs.short_title &&
                    frs.summary == rs.summary &&
                    frs.author_article == rs.author_article;
            });

            if (!foundDuplicate) {
                filteredResults.push({
                    _id: rs_id,
                    category_type_article: rs.category_type_article,
                    title: rs.title,
                    short_title: rs.short_title,
                    summary: rs.summary,
                    author_article: rs.author_article,
                    count: 1
                });

                if (filteredResults.length > 3)
                    return filteredResults;
            } else
                foundDuplicate.count += 1;
        } else {
            filteredResults.push({
                title: rs.title,
                _id: rs._id,
                category_type_article: rs.category_type_article,
                short_title: rs.short_title,
                summary: rs.summary,
                author_article: rs.author_article,
                count: 1
            });

        }
    }

    return filteredResults;
}

// exports.getClassDetails = function(req, res, next) {
//     articleIndex.getClass(req.body.classIds, function(err, result) {
//         if (err) {
//             return next(new restify.errors.InternalServerError(err));
//         } else if (check.isUndefinedOrNullOrEmpty(result)) {
//             return next(new restify.NotFoundError({
//                 message: 'Details not found',
//                 userId: req.userId,
//                 metadata: req.body
//             }));
//         } else {
//             console.log(result);

//             //Since the repote abuse filter is not working
//             if (result.docs && result.docs.length > 0) {
//                 _.remove(result.docs, function(rpl) {
//                     return rpl.found == false || rpl._source.hasPublished == false;
//                 });
//             }

//             res.status(200);
//             res.send(result.docs);
//             return next();
//         }
//     });
// };

exports.artistkeywordsSearchParms = function (req, res, next) {
    articleIndex.ArticleIndexparams({
        indexName: appConst.indexNames.articleIndex,
        id: req.body._id,
        es: es.getElastic()
    }, function (err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err + ' dddd'));
        }

        res.status(200);
        res.send(response);
    });
};
