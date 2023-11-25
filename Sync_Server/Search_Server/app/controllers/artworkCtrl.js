var path = require('path');
var async = require('async');
var _ = require('lodash-node');
var restify = require('restify');
var es = require(path.join(__dirname, '..', 'global', 'init', 'internal', 'initES'));
var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));
var artworkIndex = require(path.join(__dirname, '..', 'search', 'artworkIndex'));
var check = require(path.join(__dirname, '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
exports.artworkkeywordsSearch = function(req, res, next) {
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var postParam = params;
   //res.send(postParam);
    console.log(postParam.noOfRecords, "iiiiiiiiiiii");
     var indexNameArtwork = appConst.indexNames.artworkIndex;
    artworkIndex
        .getArtworkSearchResults(postParam, indexNameArtwork,
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

                return frs.title == rs.title &&
                    frs.artworkType == rs.artworkType &&
                    frs.extraDescription == rs.extraDescription
                   
            });

            if (!foundDuplicate) {
                filteredResults.push({
                    title: rs.title,
                    artworkType: rs.artworkType,
                    extraDescription: rs.extraDescription
                  
                });

                if (filteredResults.length > 3)
                    return filteredResults;
            } else
                foundDuplicate.count += 1;
        } else {
            filteredResults.push({
                title: rs.title,
                artworkType: rs.artworkType,
                extraDescription: rs.extraDescription
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

exports.artworksskeywordsSearchParms = function(req, res, next,indexName) {
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
                    title:postParam
                 }
              }
              }
            },
            "highlight": {
                "fields" : {
                    "title" : {}
                }
            },
   }
   es.getElastic().search({
        index: indexName,
        type: 'artworkModelDocument',
        body: body
    }).then(results => {
            res.send(results);
          })
          .catch(err=>{
           // console.log(err)
            res.send(err);
    });
};