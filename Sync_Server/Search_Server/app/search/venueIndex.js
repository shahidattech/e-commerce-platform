var path = require('path');
var _ = require('lodash-node');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
// var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));


function getVenuesSearchResults(input, indexName, callback) {
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
                fields: ["entityName", "entityType", "locationName", "briefInfo"
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
        type: 'venuesModelDocument',
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

exports.getVenuesSearchResults = getVenuesSearchResults;

function generateElasticSearchFilters(input) {
    var filter = {
        'and': {
            'filters': []
        }
    };
    var andFilter = [];

    if (input.entityName && input.entityName.length > 0) {
        andFilter.push({
            "terms": {
                "entityName": input.entityName
            }
        });
    }

    if (input.entityType && input.entityType.length > 0) {
        andFilter.push({
            "terms": {
                "entityType": input.entityType
            }
        });
    }
    if (input.locationName && input.locationName.length > 0) {
        andFilter.push({
            "terms": {
                "locationName": input.locationName
            }
        });
    }
    if (input.briefInfo && input.briefInfo.length > 0) {
        andFilter.push({
            "terms": {
                "briefInfo": input.briefInfo
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