var path = require('path');
var _ = require('lodash-node');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
// var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));


function getArticleSearchResults(input, indexName, callback) {
    var inputFilter = {};
    if (input.filters) {
        inputFilter = generateElasticSearchFilters(input.filters);
    } else {
        inputFilter = generateElasticSearchFilters({});
    }

    var inputQuery = { match_all: {} };
    if (input.searchText) {
        inputQuery = {
            multi_match: {
                query: input.searchText,
                fields: ["title", "short_title",
                    "summary", "author_article","category_type_article"
                ]
            }
        };
    }
    
    var searchBody = {
        from: input.startIndex,
        size: input.noOfRecords,
        query: inputQuery,
        // filter: inputFilter,
        // aggs: {
        //     title: {
        //         terms: {
        //             field: 'title'
        //         }
        //     }
        // },
        // aggs: {
        //     "counts": {
        //         "filter": {
        //             "term": { "hasPublished": true }
        //         },
        //         // "aggs": {
        //         //     "title": {
        //         //         "terms": { "field": "title" }
        //         //     }
        //         // }
        //     }
        // },
        sort: [{ "_score": { "order": "desc" }}
        ]
    };

    console.log(es);
    es.getElastic().search({
        index: indexName,
        type: 'articleModelDocument',
        body: searchBody
    }, function(err, result) {
        console.log(result);
        if (err)
            return callback(err, {});
        if (!result.hits)
            return callback(null, {});


        var searchResult = { data: result.hits.hits };

        if (!input.isAutoSuggest) {
            searchResult.agg = result.aggregations;
        }

        callback(null, searchResult);
    });
}

exports.getArticleSearchResults = getArticleSearchResults;

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

    if (input.summary && input.summary.length > 0) {
        andFilter.push({
            "terms": {
                "summary": input.summary
            }
        });
    }

    if (input.author_article && input.author_article.length > 0) {
        andFilter.push({
            "terms": {
                "author_article": input.author_article
            }
        });
    }
    if (input.category_type_article && input.category_type_article.length > 0) {
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
         body: {
        query: {
            match: {
                        "title": 'Node.js'
                    }
                }
            },
        id: param._id
    }, cb);
}