var restify = require('restify');
var path = require('path');
var articleHome = require('mongoose').model('homepageconfig');
var url = require('url');

// var homeConfigModel = require('mongoose').model('homeConfig');
var homeConfigModel = require('mongoose').model('homeConfigTheme1');
var homeSliderModel = require('mongoose').model('sliderModel');
// var homeSliderModel = require('mongoose').model('sliderModel');

var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));


exports.getHomePage = function (req, res, next){
    var cursor = homeConfigModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    // var pages = params.page;
    var pages = 1;
    var userId = params.userId;
    console.log(userId)
    let Projection = {
        //     title:1,
        //    summary:1,
        //    author_article:1,
        //    added_date:1,
        //   Published:1 
        };
    var query = cursor.find({_id: userId}, Projection)
    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
        //   customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };

    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, results){
            if(err){    
                return next(new restify.errors.InternalServerError(err));
            }else{
                if(results.docs){
                res.send({"result": results.docs});
                }else{
                res.send({"result": null});
                }
            }
        });
    }    

};

exports.getHomeSlider = function (req, res, next){
    var cursor = homeSliderModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    // var pages = params.page;
    var pages = 1;
    var userId = params.userId;
    var productId = params.productId;

    let Projection = {
        //     title:1,
        //    summary:1,
        //    author_article:1,
        //    added_date:1,
        //   Published:1 
        };
    var query = cursor.find({_id: userId}, Projection)
    const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
        //   customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };

    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, results){
            if(err){    
                return next(new restify.errors.InternalServerError(err));
            }else{
                if(results.docs){
                res.send({"result": results.docs});
                }else{
                res.send({"result": null});
                }
            }
        });
    }    

};

exports.getCatSubCatSubSub = function(req, res){
    let getCatSubCatSubSub_resp = {};
    try {
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        let userId = params["userId"];
        let themeId = params["themeId"];
        homeConfigTheme1Model.findById({_id: userId}, function(err, result){
            if(err){
                getCatSubCatSubSub_resp.status = 500;
                getCatSubCatSubSub_resp.data = "Internal error while fetching the category information";
                res.status(200);
                res.send(getCatSubCatSubSub_resp);
            }
            else{
                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                    getCatSubCatSubSub_resp.status = 200;
                    getCatSubCatSubSub_resp.cat_subCat_subSubCat = result.cat_subCat_subSubCat;
                    getCatSubCatSubSub_resp.storeGeneralInfo = result.storeGeneralInfo;
                    console.log(result.storeGeneralInfo);
                    res.status(200);
                    res.send(getCatSubCatSubSub_resp);
                }
                else{
                    getCatSubCatSubSub_resp.status = 204;
                    getCatSubCatSubSub_resp.data = "No Data found";
                    res.status(204);
                    res.send(getCatSubCatSubSub_resp);
                }
            }
        });
    } catch (error) {
        logger.error('Error while fetching the cat_subCat_subSubCat', error);
        getCatSubCatSubSub_resp.status = 500;
        getCatSubCatSubSub_resp.data = "Internal Error";
        res.status(500);
        res.send(getCatSubCatSubSub_resp);
    }
}


