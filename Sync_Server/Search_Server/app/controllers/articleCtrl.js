var path = require('path');
var async = require('async');
var _ = require('lodash-node');
var restify = require('restify');
var appConst = require(path.join(__dirname, '..', 'global', 'config', 'appConstant'));
var articleIndex = require(path.join(__dirname, '..', 'search', 'articleIndex'));
var check = require(path.join(__dirname, '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
var es = require(path.join(__dirname, '..', 'global', 'init', 'initEs'));
exports.articlekeywordsSearch = function(req, res, next) {
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var postParam = params;
   //res.send(postParam);
    console.log(postParam.noOfRecords, "iiiiiiiiiiii");
     var indexNameArticle = appConst.indexNames.articleIndex;
    articleIndex
        .getArticleSearchResults(postParam, indexNameArticle,
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
                console.log(aggData);
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
                    frs._id == rs._id &&
                    frs.category_type_article == rs.category_type_article &&
                    frs.short_title == rs.short_title &&
                    frs.summary == rs.summary &&
                    frs.author_article == rs.author_article;
            });

            if (!foundDuplicate) {
                filteredResults.push({
                    _id : rs_id,
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
                _id : rs._id,
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

exports.articlekeywordsSearchParms = function(req, res, next,indexName) {
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
                    short_title:postParam
                 }
              }
              }
            },
            "highlight": {
                "fields" : {
                    "short_title" : {}
                }
            },
   }
   es.getElastic().search({
        index: indexName,
        type: 'articleModelDocument',
        body: body
    }).then(results => {
            res.send(results);
          })
          .catch(err=>{
           // console.log(err)
            res.send(err);
    });
};
