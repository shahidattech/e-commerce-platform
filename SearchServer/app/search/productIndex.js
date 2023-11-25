var path = require('path');
var _ = require('lodash-node');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
var check = require(path.join(__dirname, '..', 'util', 'checkTypes'));
// var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));


function getProductSearchResults(input, indexName, callback) {
    try {
        var inputFilter = {};
        if (input.filters) {
            inputFilter = generateElasticSearchFilters(input.filters);
        } else {
            inputFilter = generateElasticSearchFilters({});
        }
        // var inputQuery = { match_all: {} };
        // inputQuery = {
        //     multi_match: {
        //         createrId: input.userId,
        //         query: input.term,
        //         fields: ["doc.title", "doc.short_title", "doc.main_category", "doc.sub_category", "doc.sub_sub_category"]
        //     }
        // };
        let inputQuery =  {
            "bool": {
              "should": [
                {
                multi_match: {
                        query: input.term,
                        fields: ["doc.title", "doc.short_title", "doc.main_category", "doc.sub_category", "doc.sub_sub_category"]
                     }
                }
              ],
              "must": [
                 {"match": {"doc.createrId" : input.userId}}
              ]
            }
          };
        
        var searchBody = {
            from: input.startIndex,
            size: input.noOfRecords,
            query: inputQuery,
            sort: [{ "_score": { "order": "desc" } }
            ]
        };
        console.log('searchBody', searchBody, indexName);
        es.getElastic().search({
            index: indexName,
            type: 'productModelDocument',
            body: searchBody
        }, function (err, result) {
            if (err){
                callback(err, null);
            }
            else{
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result.hits)) {
                    var searchResult = { data: result.hits.hits };
                    if (!input.isAutoSuggest) {
                        searchResult.agg = result.aggregations;
                        callback(null, searchResult);
                    }
                    else{
                        callback(null, searchResult);
                    }
                }
                else{
                    callback(null, false);
                }
            }
        });
    } catch (error) {
        console.log('error 57', error);
        callback(error, error);
    }
}


exports.getProductSearchResults = getProductSearchResults;

function generateElasticSearchFilters(input) {
    var filter = {
        'and': {
            'filters': []
        }
    };
    var andFilter = [];

    if (input.title && input.title.length > 0) {
        andFilter.push({
            "terms": {
                "title": input.title
            }
        });
    }

    if (input.short_title && input.short_title.length > 0) {
        andFilter.push({
            "terms": {
                "short_title": input.short_title
            }
        });
    }

    if (input.main_category && input.main_category.length > 0) {
        andFilter.push({
            "terms": {
                "summary": input.summary
            }
        });
    }

    if (input.sub_category && input.sub_categorylength > 0) {
        andFilter.push({
            "terms": {
                "author_article": input.author_article
            }
        });
    }
    if (input.sub_sub_category && input.sub_sub_category.length > 0) {
        andFilter.push({
            "terms": {
                "category_type_article": input.category_type_article
            }
        });
    }

    andFilter.push({
        "term": {
            "hasPublished": true
        }
    });

    if (andFilter.length > 0) {
        filter.and.filters = andFilter;
        filter.and._cache = false;
    }
    
    return filter;
}

exports.ArticleIndexparams = function(param, cb) {
    param.es.get({
        index: param.indexName,
        type: "articleModelDocument",
        id: param._id
    }, cb);
}