var path = require('path');
var _ = require('lodash-node');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
// var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));


function getSlideshowSearchResults(input, indexName, callback) {
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
                fields: ["title", "description"
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
        type: 'slideshowModelDocument',
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

exports.getSlideshowSearchResults = getSlideshowSearchResults;

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

    if (input.description && input.description.length > 0) {
        andFilter.push({
            "terms": {
                "description": input.description
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