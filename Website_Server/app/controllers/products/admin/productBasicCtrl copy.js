var restify = require('restify');
var logger = require('logger').createLogger();
const { validationResult } = require('express-validator');
var path = require('path');
const fs = require('fs');
var fileJson = path.join(__dirname, 'category.json');
var productModel = require('mongoose').model('Product');


var articleModel = require('mongoose').model('articleModel');
var slideShowModel = require('mongoose').model('slideShowModel');
var artistModel = require('mongoose').model('artistModel');
var eventsModel = require('mongoose').model('eventsModel');
var artworkModel = require('mongoose').model('artworkModel');
var venuesModel = require('mongoose').model('EntityLocationProfileModel');
var categoryTypeModel = require('mongoose').model('categoryTypeModel');
var mostPopularArticle = require('mongoose').model('mostpopulararticleconfig');
var articleHome = require('mongoose').model('homepageconfig');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var db_data = require('../../../data/db_data');
var url = require('url');




// exports.getProductByID = function (req, res, next){
//     try {
//         var cursor = productModel;
//         var url_data = url.parse(req.url, true);
//         var params = url_data.query;
//         // var pages = params.page;
//         var pages = 1;
//         var _id = params.productId;
//         var createrId = params.userId;
        
//         let Projection = {
//             //     title:1,
//             //    summary:1,
//             //    author_article:1,
//             //    added_date:1,
//             //   Published:1 
//             };
//         var query = cursor.find({_id, 'createrId': createrId}, Projection)
//         const myCustomLabels = {
//             totalDocs: 'itemCount',
//             docs: 'itemsList',
//             limit: 'perPage',
//             page: 'currentPage',
//             nextPage: 'next',
//             prevPage: 'prev',
//             totalPages: 'pageCount',
//             hasPrevPage: 'hasPrev',
//             hasNextPage: 'hasNext',
//             pagingCounter: 'pageCounter'
//         };
//         var options = {
//               page: Number(pages),
//               limit:20,
//               pages: 5,
//             //   customLabels: myCustomLabels,
//               sort: { added_date: -1 },
//              // customLabels: myCustomLabels
//             };
    
//         if (!cursor){
//             return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
//         }
//         else{
//             cursor.paginate(query, options, function(err, results){
//                 if(err){    
//                     return next(new restify.errors.InternalServerError(err));
//                 }else{
//                     if(!check.isUndefinedOrNullOrEmptyOrNoLen(results)){
//                     res.send({"result": results.docs});
//                     }else{
//                     res.send({"result": null});
//                     }
//                 }
//             });
//         }            
//     } catch (error) {
        
//     }

// };

exports.getProductByID = function (req, res, next) {
    try {
        let getProductByID_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            getProductByID_resp.status = 400;
            getProductByID_resp.data = 'Bad request';
            res.status(400);
            res.send(getProductByID_resp);
        }
        else {
            var url_data = url.parse(req.url, true);
            var params = url_data.query;
            var productId = params.productId;
            var createrId = params.userId;
            productModel.findOne({ _id: createrId, "products._id": productId }, function (err, result) {
                if (err) {
                    logger.error('getProductByID:: Error fetching the product', err);
                    getProductByID_resp.status = 500;
                    getProductByID_resp.data = 'Internal Server Error!';
                    res.status(500);
                    res.send(getProductByID_resp);
                }
                else {
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                        getProductByID_resp.status = 204;
                        getProductByID_resp.data = 'No Data found!';
                        res.status(204);
                        res.send(getProductByID_resp);
                    }
                    else{
                        getProductByID_resp.status = 200;
                        getProductByID_resp.data = result;
                        res.status(204);
                        res.send(getProductByID_resp);
                    }
                }   
            });
        }
    } catch (error) {
        let getProductByID_resp = {};
        logger.error('getProductByID:: Error while fetching product by ID', error);
        getProductByID_resp.status = 500;
        getProductByID_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(getProductByID_resp);
    }
}
exports.getCategories = (req, res, next) => {
    fs.readFile(fileJson, (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);
        // console.log(student);
        res.status(200);
        res.send({ data: student });

    });
};
