var path = require('path');
// var mongo = require('mongoose');
var mongo = require(path.join(__dirname, '..', 'global', 'init', 'data', 'mongodb'));
var es = require(path.join(__dirname, '..', 'global', 'init', 'initEs'));
var ac = require(path.join(__dirname, '..', 'util', 'appConst'));
var async = require('async');
var ObjectId = require('mongodb').ObjectId;
var _ = require('lodash');
var restify = require('restify');

var productIndxMgmt = require(path.join(__dirname, '..', 'indexMgr', 'productIndex'));

exports.productIndex = function (req, res) {
    try {
        let productIndex_resp = {};
        var clsData = req.body;
        // console.log('clsData', clsData);
        let createrId = req.body["userId"];
        let productId = req.body["productId"];
        let isUpdate = req.body["isUpdate"];
        let productDetails = JSON.parse(req.body['cat_subcat_subsub']['_body']);
        console.log('productDetails', productDetails, isUpdate);
        var document = {};
        // document.isUpdate = isUpdate;
        document._id = productId;
        document.createrId = createrId;
        document.title = productDetails.title;
        document.short_title = productDetails.short_title;
        // document.description = productDetails.description;
        document.main_category = productDetails.main_category;
        document.sub_category = productDetails.sub_category;
        document.sub_sub_category = productDetails.sub_sub_category;
        document.mainImage = productDetails.mainImageUrl;
        createProductIndex(document, isUpdate, function(result) {
            if(result){
                productIndex_resp.status = 200;
                res.status = 200;
                res.send(productIndex_resp);
            }
            else{
                productIndex_resp.status = 500;
                res.status = 500;
                res.send(productIndex_resp);
            }
        });

    } catch (error) {
        console.log('error', error);
    }
};

function createProductIndex(document, isUpdate, callback) {
    try {
        let param = {
            isUpdate: true,
            productData: document,
            indexName: ac.indexes.productIndex,
            isUpdate: document.isUpdate,
            es: es.getElastic()
        };
        productIndxMgmt.addProductDocument(param, function (err, response) {
            // console.log('param', param);
            if (err) {
                console.log('err', err);
                callback(err);
            }
            else{
                console.log('response', response);
                callback(true);
            }
        });
    } catch (error) {
        console.log('71', error)
    }
}


exports.removeProduct = function (req, res, next) {
    productIndxMgmt.deleteProductIndex({
        indexName: ac.indexes.productIndex,
        id: req.body.productId,
        es: es.getElastic()
    }, function (err, response) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        }
        else{
            res.status(200);
            res.send(true);
        }

    });
};
