var restify = require('restify');
var logger = require('logger').createLogger();
const { validationResult } = require('express-validator');
var path = require('path');
const fs = require('fs');
var fileJson = path.join(__dirname, 'category.json');
var productModel = require('mongoose').model('Product');
var categoryMainModel = require('mongoose').model('categoryMain');
var categorySubModel = require('mongoose').model('categorySub');
var categorySubSubModel = require('mongoose').model('categorySubSub');
var statisticsModel = require('mongoose').model('statisticsModel');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));
var url = require('url');
const { Mongoose } = require('mongoose');
const { ObjectID } = require('mongodb');

exports.getProductByID = function (req, res) {
    try {
        let getProductByID_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            getProductByID_resp.status = 400;
            getProductByID_resp.data = errors;
            res.status(400);
            res.send(getProductByID_resp);
        }
        else {
            var url_data = url.parse(req.url, true);
            var params = url_data.query;
            var productId = params.productId;
            var createrId = params.userId;
            productModel.findOne({ _id: createrId }
            ,{ "products": { $elemMatch: { _id: productId } } },
                function (err, result) {
                    if (err) {
                        logger.error('getProductByID:: Error fetching the product', err);
                        getProductByID_resp.status = 500;
                        getProductByID_resp.data = 'Internal Server Error!';
                        res.status(500);
                        res.send(getProductByID_resp);
                    }
                    else {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                            getProductByID_resp.status = 200;
                            console.log('Prod found')
                            getProductByID_resp.data = result;
                            res.status(200);
                            res.send(getProductByID_resp);
                        }
                        else {
                            getProductByID_resp.status = 204;
                            getProductByID_resp.data = 'No Data found!';
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

exports.getProductByCategoryID = function (req, res) {
    try {
        let getProductByCategoryID_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            getProductByCategoryID_resp.status = 400;
            getProductByCategoryID_resp.data = errors;
            res.status(400);
            res.send(getProductByCategoryID_resp);
        }
        else {
            var url_data = url.parse(req.url, true);
            var params = url_data.query;
            var categoryId = params.categoryId;
            var createrId = params.userId;

            // var cod = params.cod;
            var reviewed = params.reviewed;
            var color = params.color;
            var price_min = params.price_min;
            var price_max = params.price_max;
            console.log('filters1=',req.url,  reviewed, color, price_max, price_min  );

            if(!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed) || !check.isUndefinedOrNullOrEmptyOrNoLen(color) ||
            !check.isUndefinedOrNullOrEmptyOrNoLen(price_min) || !check.isUndefinedOrNullOrEmptyOrNoLen(price_max)){
                categoryMainModel.find({ _id: createrId, "categories.categoryId": categoryId }, 
                { "categories": { $elemMatch: { categoryId: categoryId } }},
                // { "categories.$.categoryId": categoryId },
                function (err, result) {
                    console.log("lalllalaa1");
                    if (err) {
                        logger.error('getProductByCategoryID:: Error fetching the category products', err);
                        getProductByCategoryID_resp.status = 500;
                        getProductByCategoryID_resp.data = 'Internal Server Error!';
                        res.status(500);
                        res.send(getProductByCategoryID_resp);
                    }
                    else {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                            let catSelectedData = result[0]['categories'][0];
                            let filteredData = {
                                "categoryId" : result[0]['categories'][0].categoryId,
                                "categoryName": result[0]['categories'][0].categoryName
                            };
                            let products = [];
                            catSelectedData["products"].forEach(prod => {
                            //    if(!check.isUndefinedOrNullOrEmptyOrNoLen(cod)){
                            //        if(prod["codOption"] == 'yes'){
                            //         products.push(prod)
                            //        }
                            //    } 
                            //    if(!check.isUndefinedOrNullOrEmptyOrNoLen(color)){
                            //     if(prod["color"] == color){
                            //         products.push(prod)
                            //        }
                            //    }
                               if(!check.isUndefinedOrNullOrEmptyOrNoLen(price_min) && !check.isUndefinedOrNullOrEmptyOrNoLen(price_max) ){
                                    prod["attributes"].forEach(pPrice => {
                                        if(pPrice["price"] >= price_min && pPrice["price"] <=price_max ){
                                            // products.push(prod)
                                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(color) && !check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                                if(reviewed == 'false'){
                                                    if (prod["color"] == color && prod["isReviewed"] === false) {
                                                        products.push(prod)
                                                    }
                                                }else{
                                                    if (prod["color"] == color && prod["isReviewed"] === true) {
                                                        products.push(prod)
                                                    }
                                                }
                                            }else if (!check.isUndefinedOrNullOrEmptyOrNoLen(color)) {
                                                if (prod["color"] == color) {
                                                    products.push(prod)
                                                }
                                            } else if (!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                                if(reviewed == 'false'){
                                                    if (prod["isReviewed"] === false) {
                                                        products.push(prod)
                                                    }
                                                } else if(reviewed == 'true'){
                                                    if (prod["isReviewed"] === true) {
                                                        products.push(prod)
                                                    }
                                                }
                                            }else{
                                                products.push(prod)
                                            }
                                        }
                                    });
                               }
                            });
                            getProductByCategoryID_resp.status = 200;
                            filteredData.products = products;
                            getProductByCategoryID_resp.data = filteredData;
                            res.status(200);
                            res.send(getProductByCategoryID_resp);
                        }
                        else {
                            getProductByCategoryID_resp.status = 204;
                            getProductByCategoryID_resp.data = 'No Data found!';
                            res.status(204);
                            res.send(getProductByCategoryID_resp);
                        }
                    }
                });
            }
            else{
                console.log('117')
                categoryMainModel.find({ _id: createrId, "categories.categoryId": categoryId }, 
                { "categories": { $elemMatch: { categoryId: categoryId } }},
                // { "categories.$.categoryId": categoryId },
                function (err, result) {
                    if (err) {
                        logger.error('getProductByCategoryID:: Error fetching the category products', err);
                        getProductByCategoryID_resp.status = 500;
                        getProductByCategoryID_resp.data = 'Internal Server Error!';
                        res.status(500);
                        res.send(getProductByCategoryID_resp);
                    }
                    else {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                            console.log('Result= ', result[0]['categories'][0]);
                            let filteredData = {
                                "categoryId" : result[0]['categories'][0].categoryId,
                                "categoryName": result[0]['categories'][0].categoryName
                            };
                            filteredData.products = result[0]['categories'][0].products;
                            getProductByCategoryID_resp.status = 200;
                            getProductByCategoryID_resp.data = filteredData;
                            res.status(200);
                            res.send(getProductByCategoryID_resp);
                        }
                        else {
                            getProductByCategoryID_resp.status = 204;
                            getProductByCategoryID_resp.data = 'No Data found!';
                            res.status(204);
                            res.send(getProductByCategoryID_resp);
                        }
                    }
                });
            }

        }
    } catch (error) {
        let getProductByCategoryID_resp = {};
        logger.error('getProductByCategoryID_resp:: Error while fetching product by ID', error);
        getProductByCategoryID_resp.status = 500;
        getProductByCategoryID_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(getProductByCategoryID_resp);
    }
}

exports.getProductBySubCategoryID = function (req, res) {
    try {
        let getProductBySubCategoryID_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            getProductBySubCategoryID_resp.status = 400;
            getProductBySubCategoryID_resp.data = errors;
            res.status(400);
            res.send(getProductBySubCategoryID_resp);
        }
        else {
            var url_data = url.parse(req.url, true);
            var params = url_data.query;
            var subCategoryId = params.subCategoryId;
            var createrId = params.userId;

            // var cod = params.cod;
            var reviewed = params.reviewed;
            var color = params.color;
            var price_min = params.price_min;
            var price_max = params.price_max;
            console.log('filters2=',req.url,  reviewed, color, price_max, price_min  );

            if(!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed) || !check.isUndefinedOrNullOrEmptyOrNoLen(color) ||
            !check.isUndefinedOrNullOrEmptyOrNoLen(price_min) || !check.isUndefinedOrNullOrEmptyOrNoLen(price_max)){
                categorySubModel.findOne({ _id: createrId, "sub_categories.subCategoryId": subCategoryId }, 
                { "sub_categories": { $elemMatch: { subCategoryId: subCategoryId } }},
                // { "sub_categories.$.subCategoryId": subCategoryId },
                    function (err, result) {
                        console.log('Result...', result);
                        if (err) {
                            logger.error('getProductBySubCategoryID:: Error fetching the category products', err);
                            getProductBySubCategoryID_resp.status = 500;
                            getProductBySubCategoryID_resp.data = 'Internal Server Error!';
                            res.status(500);
                            res.send(getProductBySubCategoryID_resp);
                        }
                        else {
                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                let subcatSelectedData = result['sub_categories'][0];
                                let filteredData = {
                                    "subCategoryId": result['sub_categories'][0].subCategoryId,
                                    "subCategoryName": result['sub_categories'][0].subCategoryName
                                };
                                let products = [];
                                subcatSelectedData["products"].forEach(prod => {
                                    // console.log(prod);
                                    // if (!check.isUndefinedOrNullOrEmptyOrNoLen(cod)) {
                                    //     if (prod["codOption"] == 'yes') {
                                    //         products.push(prod)
                                    //     }
                                    // }
                                    // if (!check.isUndefinedOrNullOrEmptyOrNoLen(color)) {
                                    //     if (prod["color"] == color) {
                                    //         products.push(prod)
                                    //     }
                                    // }
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(price_min) && !check.isUndefinedOrNullOrEmptyOrNoLen(price_max)) {
                                        prod["attributes"].forEach(pPrice => {
                                            if(pPrice["price"] >= price_min && pPrice["price"] <=price_max ){
                                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(color) && !check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                                    if(reviewed == 'false'){
                                                        if (prod["color"] == color && prod["isReviewed"] === false) {
                                                            products.push(prod)
                                                        }
                                                    }else{
                                                        if (prod["color"] == color && prod["isReviewed"] === true) {
                                                            products.push(prod)
                                                        }
                                                    }
                                                }else if (!check.isUndefinedOrNullOrEmptyOrNoLen(color)) {
                                                    if (prod["color"] == color) {
                                                        products.push(prod)
                                                    }
                                                } else if (!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                                    if(reviewed == 'false'){
                                                        if (prod["isReviewed"] === false) {
                                                            products.push(prod)
                                                        }
                                                    } else if(reviewed == 'true'){
                                                        if (prod["isReviewed"] === true) {
                                                            products.push(prod)
                                                        }
                                                    }
                                                }else{
                                                    products.push(prod)
                                                }
                                            }
                                        });
                                    }
                                });
                                // getProductByCategoryID_resp.status = 200;
                                filteredData.products = products;

                                getProductBySubCategoryID_resp.status = 200;
                                getProductBySubCategoryID_resp.data = filteredData;
                                res.status(200);
                                res.send(getProductBySubCategoryID_resp);
                            }
                            else {
                                getProductBySubCategoryID_resp.status = 204;
                                getProductBySubCategoryID_resp.data = 'No Data found!';
                                res.status(204);
                                res.send(getProductBySubCategoryID_resp);
                            }
                        }
                    }); 
            }
            else{
                categorySubModel.findOne({ _id: createrId, "sub_categories.subCategoryId": subCategoryId },
                { "sub_categories": { $elemMatch: { subCategoryId: subCategoryId } }},
                // { "sub_categories.$.subCategoryId": subCategoryId },
                    function (err, result) {
                        console.log('Result...', result);
                        if (err) {
                            logger.error('getProductBySubCategoryID:: Error fetching the category products', err);
                            getProductBySubCategoryID_resp.status = 500;
                            getProductBySubCategoryID_resp.data = 'Internal Server Error!';
                            res.status(500);
                            res.send(getProductBySubCategoryID_resp);
                        }
                        else {
                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                let filteredData = {
                                    "subCategoryId": result['sub_categories'][0].subCategoryId,
                                    "subCategoryName": result['sub_categories'][0].subCategoryName
                                };
                                filteredData.products = result['sub_categories'][0].products;
                                getProductBySubCategoryID_resp.status = 200;
                                getProductBySubCategoryID_resp.data = filteredData;
                                res.status(200);
                                res.send(getProductBySubCategoryID_resp);
                            }
                            else {
                                getProductBySubCategoryID_resp.status = 204;
                                getProductBySubCategoryID_resp.data = 'No Data found!';
                                res.status(204);
                                res.send(getProductBySubCategoryID_resp);
                            }
                        }
                    });                
            }
        }
    } catch (error) {
        let getProductBySubCategoryID_resp = {};
        logger.error('getProductBySubCategoryID_resp:: Error while fetching product by ID', error);
        getProductBySubCategoryID_resp.status = 500;
        getProductBySubCategoryID_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(getProductBySubCategoryID_resp);
    }
}

exports.getProductBySubSubID = function (req, res) {
    try {
        let getProductBySubSubID_resp = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            getProductBySubSubID_resp.status = 400;
            getProductBySubSubID_resp.data = errors;
            res.status(400);
            res.send(getProductBySubSubID_resp);
        }
        else {
            var url_data = url.parse(req.url, true);
            var params = url_data.query;
            var subSubCategoryId = params.subSubCategoryId;
            var createrId = params.userId;

            // var cod = params.cod;
            var reviewed = params.reviewed;
            var color = params.color;
            var price_min = params.price_min;
            var price_max = params.price_max;
            console.log('filters3=',req.url,  reviewed, color, price_max, price_min  );
            
            if(!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed) || !check.isUndefinedOrNullOrEmptyOrNoLen(color) ||
            !check.isUndefinedOrNullOrEmptyOrNoLen(price_min) || !check.isUndefinedOrNullOrEmptyOrNoLen(price_max)){
            categorySubSubModel.findOne({ _id: createrId, "sub_sub_categories.subSubCategoryId": subSubCategoryId }, 
            { "sub_sub_categories": { $elemMatch: { subSubCategoryId: subSubCategoryId } }},
            // { "sub_sub_categories.$.subSubCategoryId": subSubCategoryId },
            function (err, result) {
                if (err) {
                    logger.error('getProductBySubCategoryID:: Error fetching the category products', err);
                    getProductBySubSubID_resp.status = 500;
                    getProductBySubSubID_resp.data = 'Internal Server Error!';
                    res.status(500);
                    res.send(getProductBySubSubID_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        let subsubcatSelectedData = result['sub_sub_categories'][0];
                        let filteredData = {
                            "subSubCategoryId": result['sub_sub_categories'][0].subSubCategoryId,
                            "subSubCategoryName": result['sub_sub_categories'][0].subSubCategoryName
                        };
                        let products = [];
                        subsubcatSelectedData["products"].forEach(prod => {
                            // if (!check.isUndefinedOrNullOrEmptyOrNoLen(cod)) {
                            //     if (prod["codOption"] == 'yes') {
                            //         products.push(prod)
                            //     }
                            // }
                            // if (!check.isUndefinedOrNullOrEmptyOrNoLen(color)) {
                            //     if (prod["color"] == color) {
                            //         products.push(prod)
                            //     }
                            // }
                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(price_min) && !check.isUndefinedOrNullOrEmptyOrNoLen(price_max)) {
                                prod["attributes"].forEach(pPrice => {
                                    if(pPrice["price"] >= price_min && pPrice["price"] <=price_max ){
                                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(color) && !check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                            if(reviewed == 'false'){
                                                if (prod["color"] == color && prod["isReviewed"] === false) {
                                                    products.push(prod)
                                                }
                                            }else{
                                                if (prod["color"] == color && prod["isReviewed"] === true) {
                                                    products.push(prod)
                                                }
                                            }
                                        }else if (!check.isUndefinedOrNullOrEmptyOrNoLen(color)) {
                                            if (prod["color"] == color) {
                                                products.push(prod)
                                            }
                                        } else if (!check.isUndefinedOrNullOrEmptyOrNoLen(reviewed)) {
                                            if(reviewed == 'false'){
                                                if (prod["isReviewed"] === false) {
                                                    products.push(prod)
                                                }
                                            } else if(reviewed == 'true'){
                                                if (prod["isReviewed"] === true) {
                                                    products.push(prod)
                                                }
                                            }
                                        }else{
                                            products.push(prod)
                                        }
                                    }
                                });
                            }
                        });
                        filteredData.products = products;
                        getProductBySubSubID_resp.status = 200;
                        getProductBySubSubID_resp.data = filteredData;
                        res.status(200);
                        res.send(getProductBySubSubID_resp);
                    }
                    else {
                        getProductBySubSubID_resp.status = 204;
                        getProductBySubSubID_resp.data = 'No Data found!';
                        res.status(204);
                        res.send(getProductBySubSubID_resp);
                    }
                }
            });

               
            }
            else{
                categorySubSubModel.findOne({ _id: createrId, "sub_sub_categories.subSubCategoryId": subSubCategoryId }, 
                { "sub_sub_categories": { $elemMatch: { subSubCategoryId: subSubCategoryId } }},
                // { "sub_sub_categories.$.subSubCategoryId": subSubCategoryId },
                function (err, result) {
                    if (err) {
                        logger.error('getProductBySubCategoryID:: Error fetching the category products', err);
                        getProductBySubSubID_resp.status = 500;
                        getProductBySubSubID_resp.data = 'Internal Server Error!';
                        res.status(500);
                        res.send(getProductBySubSubID_resp);
                    }
                    else {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                            let filteredData = {
                                "subSubCategoryId": result['sub_sub_categories'][0].subSubCategoryId,
                                "subSubCategoryName": result['sub_sub_categories'][0].subSubCategoryName
                            };
                            filteredData.products = result['sub_sub_categories'][0].products;
                            getProductBySubSubID_resp.status = 200;
                            getProductBySubSubID_resp.data = filteredData;
                            res.status(200);
                            res.send(getProductBySubSubID_resp);
                        }
                        else {
                            getProductBySubSubID_resp.status = 204;
                            getProductBySubSubID_resp.data = 'No Data found!';
                            res.status(204);
                            res.send(getProductBySubSubID_resp);
                        }
                    }
                });
            }
        }
    } catch (error) {
        let getProductBySubSubID_resp = {};
        logger.error('getProductBySubCategoryID_resp:: Error while fetching product by ID', error);
        getProductBySubSubID_resp.status = 500;
        getProductBySubSubID_resp.data = 'Internal Server Error';
        res.status(500);
        res.send(getProductBySubSubID_resp);
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

// Save ratings and Reviews
exports.addRatingAdnReviews = function (req, res) {
    try {
        let addRatingAdnReviews = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            placeOrder_resp.status = 422;
            placeOrder_resp.data = 'Invalid Input';
            res.status(422);
            res.send(placeOrder_resp);
        }
        else {
            let sellerId = req.body["userId"];
            let productId = req.body["productId"];
            let rNrData = {
                customerId: req.body["customerId"],
                customerName: req.body["customerName"],
                customerProfilePic: req.body["customerProfilePic"],
                rating: req.body["rating"],
                review: req.body["review"],

            }
            productModel.findOne({ _id: sellerId},
            function(err, result) {
                // {$push:{"products.$.ratings_reviews": rNrData}},  function(err, result) {
                if (err) {
                    addRatingAdnReviews.status = 500;
                    addRatingAdnReviews.data = 'Sorry !! We are not able to add your feedback currently !';
                    res.send(addRatingAdnReviews);
                }
                else {
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(result) && !check.isUndefinedOrNullOrEmptyOrNoLen(result["products"])){
                        let counter = 0;
                        result["products"].forEach(product=>{
                            if(product["_id"] == productId ){
                                product.ratings_reviews.push(rNrData);
                                product.isReviewed = true;
                                result.save(function(err, result){
                                    if(err){
                                        addRatingAdnReviews.status = 500;
                                        addRatingAdnReviews.data = 'Sorry not able to update your valuable feedback !!';
                                        res.send(addRatingAdnReviews);
                                    }
                                    else{
                                        addRatingAdnReviews.status = 200;
                                        addRatingAdnReviews.data = 'Thanks for providing your valuable feedback !!';
                                        writernrCountStatistics(sellerId, function(result){
                                            res.send(addRatingAdnReviews);
                                        });
                                    }
                                });
                            }
                            // else{
                            //     addRatingAdnReviews.status = 500;
                            //     addRatingAdnReviews.data = 'Product not found !!';
                            //     res.send(addRatingAdnReviews);
                            // }
                        });
                    }
                    else{
                        addRatingAdnReviews.status = 418;
                        addRatingAdnReviews.data = 'Product not found !!';
                        res.send(addRatingAdnReviews);
                    }
                }
            });
    }
    } catch (error) {
        console.log('err', error);
        addRatingAdnReviews.status = 500;
        addRatingAdnReviews.data = 'Sorry !! We are not able to add your feedback currently !';
        res.send(addRatingAdnReviews);
    }
}

function writernrCountStatistics(sellerId, callback) {
    try {
        
        let today = new Date();
        let dateKey = today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString();
        console.log('writeProductCountStatistics',dateKey, today.getDate(),today.getMonth(),today.getFullYear()  );
        statisticsModel.findOne({ _id: sellerId },
        function(err, result) {
            if(err){
                callback(false);
            }
            else{
                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                    statisticsModel.findOne({ _id: sellerId , "stat.currentDate" : dateKey},
                    function(err, resultStat){
                        if(err){
                            callback(false);
                        }
                        else{
                            if(!check.isUndefinedOrNullOrEmptyOrNoLen(resultStat)){
                                resultStat["stat"].forEach(statDay=>{
                                    if(statDay["currentDate"] == dateKey){
                                        statDay.rnrCount = statDay.rnrCount + 1;
                                        resultStat.save(function(err, result){
                                            if(err){
                                                console.log('err', err)
                                                callback(false);
                                            }
                                            else{
                                                callback(true);
                                            }
                                        });
                                    }
                                })
                                
                            }
                            else{
                                let statData = {
                                    currentDate: dateKey,
                                    orderCount : 0,
                                    customerCount: 0,
                                    rnrCount:0,
                                    productCount: 1
                                };
                                result["stat"].push(statData);
                                result.save(function(err, result){
                                    if(err){
                                        console.log('err', err)
                                        callback(false);
                                    }
                                    else{
                                        callback(true);
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    let statModelObj = new statisticsModel();
                    statModelObj._id = sellerId;
                    let statData = {
                        currentDate: dateKey,
                        orderCount : 0,
                        customerCount: 0,
                        rnrCount:1,
                        productCount: 0
                    };
                    statModelObj["stat"].push(statData);
                    statModelObj.save(function(err, result){
                        if(err){
                            console.log('err', err)
                            callback(false);
                        }
                        else{
                            callback(true);
                        }
                    });
                }
            }
        });
            
    } catch (error) {
        console.log('Err', error);
        callback(false);
    }
}
