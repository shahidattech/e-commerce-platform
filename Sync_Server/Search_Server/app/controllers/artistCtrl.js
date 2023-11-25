var path = require('path');
var async = require('async');
var _ = require('lodash-node');
var restify = require('restify');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));
var artistIndex = require(path.join(__dirname, '..', 'search', 'artistIndex'));
var check = require(path.join(__dirname, '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
exports.artistkeywordsSearch = function(req, res, next) {
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var postParam = params;
   //res.send(postParam);
    console.log(postParam.noOfRecords, "iiiiiiiiiiii");
     var indexNameArtist = appConst.indexNames.artistIndex;
    artistIndex
        .getArtistSearchResults(postParam, indexNameArtist,
            function(err, result) {
                if (err) {
                    return next(new restify.errors.InternalServerError(err, 'error'));
                }
                var searchResultItems = _.sortByOrder(result.data, ['_score'], ['desc']);
                var aggData = result.agg;

                if (postParam.isAutoSuggest) {
                    searchResultItems = removeDuplicates(searchResultItems);
                }
                res.status(200);
                res.send(searchResultItems);
                next();

            });
};

function removeDuplicates(results) {
    var filteredResults = [];

    for (var index = 0; index < results.length; index++) {
        var rs = results[index]._source;

        if (filteredResults.length > 0) {
            var foundDuplicate = _.find(filteredResults, function(frs) {

                return frs.artistName == rs.artistName &&
                    frs.nationality == rs.nationality &&
                    frs.articleDescription == rs.articleDescription
                   
            });

            if (!foundDuplicate) {
                filteredResults.push({
                    artistName: rs.artistName,
                    nationality: rs.nationality,
                    articleDescription: rs.articleDescription
                  
                });

                if (filteredResults.length > 3)
                    return filteredResults;
            } else
                foundDuplicate.count += 1;
        } else {
            filteredResults.push({
                artistName: rs.artistName,
                nationality: rs.nationality,
                articleDescription: rs.articleDescription
            });

        }
    }

    return filteredResults;
}

// exports.getClassDetails = function(req, res, next) {
//     venueIndex.getClass(req.body.classIds, function(err, result) {
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

// keyword search in elastic search
exports.artistkeywordsSearchParms = function(req, res, next,indexName) {
  var url_data = url.parse(req.url, true);
  var params = url_data.search;
  var postParam = params;
  //res.send(url_data);
   let body = {
            size: 40,
            from: 0, 
            query: {
              bool :{
                must :{
                 match: {
                    artistName:postParam
                 }
              }
              }
            },
            "highlight": {
                "fields" : {
                    "artistName" : {}
                }
            },
   }
   es.getElastic().search({
        index: indexName,
        type: 'artistModelDocument',
        body: body
    }).then(results => {
            res.send(results);
          })
          .catch(err=>{
           // console.log(err)
            res.send(err);
    });
};