var path = require('path');
var restify = require('restify');
var productModel = require('mongoose').model('Product');
var categoryMainModel = require('mongoose').model('categoryMain');
var categorySubModel = require('mongoose').model('categorySub');
var categorySubSubModel = require('mongoose').model('categorySubSub');
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var statisticsModel = require('mongoose').model('statisticsModel');
// var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var _ = require('lodash');
var url = require('url');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { chownSync } = require('fs');
var logger = require('logger').createLogger();
const MUUID = require('uuid-mongodb');
const { contextsKey } = require('express-validator/src/base');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));



exports.createProduct = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let createProduct_resp = {};
            createProduct_resp.status = 422;
            createProduct_resp.data =  errors;
            // res.status(422);
            res.send(createProduct_resp);
        }
        else {
            let createProduct_resp = {};
            let productInputData = req.body;
            let formattedProdData = formatProductData(productInputData, req);
            productModel.findById({ _id: formattedProdData.createrId }, function (err, result) {
                if (err) {
                    // logger.error('createProduct:: error in finding findById', err);
                    createProduct_resp.status = 422;
                    createProduct_resp.data = 'Error occurred while Adding your product!!';
                    res.send(createProduct_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        result.products.push(formattedProdData);
                        result.save(function (err, justPushedDocument) {
                            if (err) {
                                createProduct_resp.status = 500;
                                createProduct_resp.data = ' Error while appending the document!';
                                res.send(createProduct_resp);
                            }
                            else {
                                createProduct_resp.status = 200;
                                createProduct_resp.data = justPushedDocument.products.pop()._id;
                                console.log('writeProductCountStatistics 55', formattedProdData.createrId);
                                writeProductCountStatistics(formattedProdData.createrId, function(result){
                                    res.send(createProduct_resp);
                                });
                            }
                        });

                    }
                    else {
                        prodDoc = new productModel();
                        console.log('formattedProdData.cretorId', formattedProdData.createrId);
                        prodDoc._id = formattedProdData.createrId;
                        prodDoc.products.push(formattedProdData);
                        prodDoc.save(function (err, justPushedDocument) {
                            if (err) {
                                console.log('Err creting first prod', err);
                                createProduct_resp.status = 500;
                                createProduct_resp.data = ' Error while adding the first document!';
                                res.send(createProduct_resp);
                            }
                            else {
                                createProduct_resp.status = 200;
                                createProduct_resp.data = justPushedDocument.products[0]._id;
                                writeProductCountStatistics(formattedProdData.createrId, function(result){
                                    res.send(createProduct_resp);
                                });
                            }
                        });
                    }
                }
            });
        }
    } catch (error) {
        console.log('create prod=', err);
        logger.error('Exception occurred while adding Product: ', err);
        createProduct_resp.status = 500;
        createProduct_resp.data = 'Internal Server error!';
        res.send(createProduct_resp);
    }
}

function writeProductCountStatistics(sellerId, callback) {
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
                            console.log('result 115', resultStat);
                            if(!check.isUndefinedOrNullOrEmptyOrNoLen(resultStat)){
                                resultStat["stat"].forEach(statDay=>{
                                    if(statDay["currentDate"] == dateKey){
                                        statDay.productCount = statDay.productCount + 1;
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
                        rnrCount:0,
                        productCount: 1
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

// need to remove this function
exports.updateProduct_old = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let createProduct_resp = {};
            createProduct_resp.status = 422;
            createProduct_resp.data =  errors;
            // res.status(422);
            res.send(createProduct_resp);
        }
        else {
            let createProduct_resp = {};
            let productInputData = req.body;
            console.log(productInputData);
           
            let formattedProdData = formatProductUpdateData(productInputData, req);
            // res.send(formattedProdData);
            // return;
            productModel.findOneAndUpdate({_id: formattedProdData.createrId, "products._id": formattedProdData._id },
            {$set:{"products.$" : formattedProdData }},
            function (err, result) {
                if (err) {
                    // logger.error('createProduct:: error in finding findById', err);
                    createProduct_resp.status = 422;
                    createProduct_resp.data = 'Error occurred while update your product!!';
                    res.send(createProduct_resp);
                }
                else {
                    console.log(result);
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        createProduct_resp.status = 200;
                        createProduct_resp.data = 'Product update successfully';
                        res.send(createProduct_resp);
                    }else{
                        createProduct_resp.status = 422;
                        createProduct_resp.data = 'Error occurred while update your product!!';
                        res.send(createProduct_resp);
                    }
                }
            });
        }
    } catch (error) {
        console.log('create prod=', err);
        logger.error('Exception occurred while adding Product: ', err);
        createProduct_resp.status = 500;
        createProduct_resp.data = 'Internal Server error!';
        res.send(createProduct_resp);
    }
}

function formatProductData(articleData, req) {
    try {
        relatedLists = [];
        if (articleData.relatedProducts && articleData.relatedProducts.length > 0) {
            for (let i = 0; i < articleData.relatedProducts.length; i++) {
                let data = {
                    _id: articleData.relatedProducts[i]._id,
                    title: articleData.relatedProducts[i].title,
                    price: articleData.relatedProducts[i].price,
                    gst: articleData.relatedProducts[i].gst,
                    short_title: articleData.relatedProducts[i].short_title,
                    mainImage: articleData.relatedProducts[i].mainImage ? articleData.relatedProducts[i].mainImage : ''
                }
                relatedLists.push(data);
            }
        }

        relatedSlide = [];
        if (articleData.relatedSlideShows && articleData.relatedSlideShows.length > 0) {
            for (let i = 0; i < articleData.relatedSlideShows.length; i++) {
                let data = {
                    title: articleData.relatedSlideShows[i].title,
                    shortTitle: articleData.relatedSlideShows[i].shortTitle,
                    slides: articleData.relatedSlideShows[i].slides
                }
                relatedSlide.push(data);
            }
        }

        return {
            // _id: articleData.userId,
            // producID: '12365kkk',
            createrId: articleData.userId,
            description: articleData.description,
            title: articleData.title,
            short_title: articleData.short_title,
            tags: articleData.tags,
            main_category: articleData.main_category,
            sub_category: articleData.sub_category,
            sub_sub_category: articleData.sub_sub_category,
            seo_keywords: articleData.seo_keywords,
            // price: articleData.price,
            codOption: articleData.codOption,
            tag: articleData.tag,
            // size: articleData.size,
            length: articleData.length,
            return_policy: articleData.return_policy,
            saveDrafts: articleData.saveDrafts,
            Published: articleData.Published,
            related_products: relatedLists,
            color: articleData.colorOption,
            stock: articleData.stock,
            relatedSlideShows: relatedSlide,
            // weight: articleData.weight,
            gst: articleData.gst,
            attributes: articleData.attributes
        };
    } catch (error) {
        console.log('formated erro', error);
        logger.info('Error occurred in formatting product Data', error);
    }

}

function formatProductUpdateData(articleData, req) {
    console.log("articleData....", articleData);
    try {
        relatedLists = [];
        if (articleData.relatedProducts && articleData.relatedProducts.length > 0) {
            for (let i = 0; i < articleData.relatedProducts.length; i++) {
                let data = {
                    _id: articleData.relatedProducts[i]._id,
                    title: articleData.relatedProducts[i].title,
                    price: articleData.relatedProducts[i].price,
                    gst: articleData.relatedProducts[i].gst,
                    short_title: articleData.relatedProducts[i].short_title,
                    mainImage: articleData.relatedProducts[i].mainImage ? articleData.relatedProducts[i].mainImage : ''
                }
                relatedLists.push(data);
            }
        }

        relatedSlide = [];
        if (articleData.relatedSlideShows && articleData.relatedSlideShows.length > 0) {
            for (let i = 0; i < articleData.relatedSlideShows.length; i++) {
                let data = {
                    title: articleData.relatedSlideShows[i].title,
                    shortTitle: articleData.relatedSlideShows[i].shortTitle,
                    slides: articleData.relatedSlideShows[i].slides
                }
                relatedSlide.push(data);
            }
        }

        return {
            // _id: articleData.userId,
            // producID: '12365kkk',
            createrId: articleData.userId,
            description: articleData.description,
            title: articleData.title,
            short_title: articleData.short_title,
            tags: articleData.tags,
            main_category: articleData.main_category,
            sub_category: articleData.sub_category,
            sub_sub_category: articleData.sub_sub_category,
            seo_keywords: articleData.seo_keywords,
            // price: articleData.price,
            codOption: articleData.codOption,
            tag: articleData.tag,
            // size: articleData.size,
            length: articleData.length,
            return_policy: articleData.return_policy,
            saveDrafts: articleData.saveDrafts,
            Published: articleData.Published,
            related_products: relatedLists,
            color: articleData.colorOption,
            stock: articleData.stock,
            relatedSlideShows: relatedSlide,
            // weight: articleData.weight,
            gst: articleData.gst,
            mainImage: articleData.mainImage,
            otherImages: articleData.otherImages,
            added_date: articleData.added_date,
            isReviewed: articleData.isReviewed,
            productId: articleData.productId,
            ratings_reviews: articleData.ratings_reviews,
            views: articleData.views,
            _id: articleData._id,
            attributes: articleData.attributes
        };
    } catch (error) {
        console.log('formated erro', error);
        logger.info('Error occurred in formatting product Data', error);
    }

}

//Saving data in cat sub and sub_sub model for faster access of products on all landing pages
exports.saveProductinCatSubcatSubSubCat = function (req, res, next) {
    let productSaveCategoryWise_Resp = {};
    try {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body["userId"]) && req.body["productId"]) {
            let userID = req.body["userId"];
            let productId = req.body["productId"];
            let cat_subcat_subsub_json = JSON.parse(req.body['cat_subcat_subsub']['_body']);
            let main_category = cat_subcat_subsub_json.main_category;
            let sub_category = cat_subcat_subsub_json.sub_category;
            let sub_sub_category = cat_subcat_subsub_json.sub_sub_category;
            let mainImageUrl = cat_subcat_subsub_json.mainImageUrl;
            let otherImages = cat_subcat_subsub_json.otherImages
            let short_title = cat_subcat_subsub_json.short_title;
            // let price = cat_subcat_subsub_json.price;
            // let weight = cat_subcat_subsub_json.weight;
            let color = cat_subcat_subsub_json.color;
            let isReviewed = cat_subcat_subsub_json.isReviewed;
            let codOption = cat_subcat_subsub_json.codOption;
            let attributes = cat_subcat_subsub_json.attributes;
            let gst = cat_subcat_subsub_json.gst;

            saveDatainMainCategory(userID, productId, short_title, main_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (categoryId) {
                console.log('categoryId=', categoryId);
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(categoryId)) {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(sub_category)) {
                        saveDatainSubCategory(userID, productId, short_title, categoryId, sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (subCategoryId) {
                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(subCategoryId)) {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(sub_sub_category)) {
                                    saveDatainSubSubCategory(userID, productId, short_title, categoryId, subCategoryId, sub_sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (subSubCategoryId) {
                                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(subSubCategoryId)) {
                                            productSaveCategoryWise_Resp.status = 200;
                                            productSaveCategoryWise_Resp.data = "Data Has been saved in all categorories and sub categories !";
                                            res.send(productSaveCategoryWise_Resp);
                                        }
                                        else {
                                            productSaveCategoryWise_Resp.status = 200;
                                            productSaveCategoryWise_Resp.data = "Data Has been saved in all categorories Only !";
                                            res.send(productSaveCategoryWise_Resp);
                                        }
                                    });
                                }
                                else {
                                    productSaveCategoryWise_Resp.status = 200;
                                    productSaveCategoryWise_Resp.data = "Data Has been saved in all category & sub category!";
                                    res.send(productSaveCategoryWise_Resp);
                                }
                            }
                            else {
                                productSaveCategoryWise_Resp.status = 415;
                                productSaveCategoryWise_Resp.data = "Data Has been saved in all category But error in Sub category!";
                                res.send(productSaveCategoryWise_Resp);
                            }
                        });
                    }
                    else {
                        productSaveCategoryWise_Resp.status = 200;
                        productSaveCategoryWise_Resp.data = "Data Has been saved in categorory model !";
                        res.send(productSaveCategoryWise_Resp);
                    }

                }
                else {
                    productSaveCategoryWise_Resp.status = 500;
                    productSaveCategoryWise_Resp.data = "Error in arranging internal data!";
                    res.send(productSaveCategoryWise_Resp);
                }
            });
        }

    } catch (error) {
        console.log('Error', error);
        productSaveCategoryWise_Resp.status = 215;
        productSaveCategoryWise_Resp.data = 'Error in saving internal data';
        logger.error('Error Occurred while arranging internal Data', error);
        res.send(productSaveCategoryWise_Resp);
    }
};

//Save data in category model for faster landing page for category
function saveDatainMainCategory(userID, productId, short_title, main_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        console.log('main_category', main_category);
        categoryMainModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('saveDatainMainCategory:: Error fetching the userId from categoryMainModel ', err);
                    callback(null);
                }
                else {
                    let product = {
                        "productId": productId,
                        "short_title": short_title,
                        // "price": price,
                        // "weight": weight,
                        "color": color,
                        "isReviewed": isReviewed,
                        "codOption": codOption,
                        "mainImageUrl": mainImageUrl,
                        "otherImages": otherImages,
                        "attributes": attributes,
                        "gst": gst
                    };
                    const categoryId = MUUID.v1().toString();
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        //get the same category for the user
                        categoryMainModel.findOne({ _id: userID, "categories.categoryName": main_category },
                            function (err, result) {
                                if (err) {
                                    logger.error('saveDatainMainCategory:: Error while fetching same category: ', err);
                                    callback(null);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                        categoryMainModel.findOneAndUpdate({ _id: userID, "categories.categoryName": main_category },
                                            { $push: { "categories.$.products": product } }, function (err, result) {
                                                if (err) {
                                                    logger.error('saveDatainMainCategory:: Error while fetching updating/pushing category: ', err);
                                                    callback(null);
                                                }
                                                else {
                                                    callback(result['categories'][0].categoryId);
                                                }
                                            });
                                    }
                                    else {
                                        //Category not found,  be appended in categories
                                        let latestProduct = {
                                            "categoryId": categoryId,
                                            "categoryName": main_category,
                                            "products": product
                                        };
                                        categoryMainModel.findOneAndUpdate({ _id: userID },
                                            { $push: { "categories": latestProduct } },
                                            function (err, result) {
                                                if (err) {
                                                    logger.error("saveDatainMainCategory:: Error while pushing in  category for same user", err);
                                                    callback(null);
                                                }
                                                else {
                                                    pushCategoryInHomeConfig(userID, categoryId, main_category, function (result) {
                                                        if (result) {
                                                            callback(categoryId);
                                                        }
                                                        else {
                                                            callback(null);
                                                        }

                                                    });

                                                }
                                            });
                                    }
                                }
                            });
                    }
                    else {
                        let catMainDoc = new categoryMainModel();
                        catMainDoc._id = userID;
                        catMainDoc.save(function (err, result) {
                            if (err) {
                                logger.error("saveDatainMainCategory :: Error while adding first category in the model", err);
                                callback(false);
                            }
                            else {
                                categoryMainModel.findByIdAndUpdate({ _id: userID },
                                    { $push: { "categories.0.products": product }, $set: { "categories.0.categoryName": main_category, "categories.0.categoryId": categoryId } }, function (err, result) {
                                        if (err) {
                                            logger.error('Error while updating the ', err);
                                            callback(false);
                                        }
                                        else {
                                            pushCategoryInHomeConfig(userID, categoryId, main_category, function (result) {
                                                if (result) {
                                                    callback(categoryId);
                                                }
                                                else {
                                                    callback(null);
                                                }
                                            });
                                        }
                                    });
                            }
                        });
                    }
                }
            });
    } catch (error) {
        console.log('Main cat', error);
        logger.error('saveDatainMainCategory:: Exception  occurred in creating data in Main category', error);
        callback(null);
    }
}

//Save data Subcategory model for faster landing page for Subcategory
function saveDatainSubCategory(userID, productId, short_title, categoryId, sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        categorySubModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('saveDatainSubCategory:: Error fetching the userId from categorySubModel ', err);
                    callback(false);
                }
                else {
                    let product = {
                        "productId": productId,
                        "short_title": short_title,
                        "attributes": attributes,
                        "gst": gst,
                        "color": color,
                        "isReviewed": isReviewed,
                        "codOption": codOption,
                        "mainImageUrl": mainImageUrl,
                        "otherImages": otherImages
                    };
                    const subCategoryId = MUUID.v1().toString();
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        //get the same Sub category for the user
                        categorySubModel.findOne({ _id: userID, "sub_categories.subCategoryName": sub_category },
                            function (err, result) {
                                if (err) {
                                    logger.error('saveDatainSubCategory:: Error while fetching same Subcategory: ', err);
                                    callback(false);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                        categorySubModel.findOneAndUpdate({ _id: userID, "sub_categories.subCategoryName": sub_category },
                                            { $push: { "sub_categories.$.products": product } }, function (err, result) {
                                                if (err) {
                                                    logger.error('saveDatainSubCategory:: Error while fetching updating/pushing Subcategory: ', err);
                                                    callback(false);
                                                }
                                                else {
                                                    result['sub_categories'].forEach(subCat=>{
                                                        if(subCat["subCategoryName"] == sub_category){
                                                            callback(subCat["subCategoryId"]);
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                    else {
                                        //SubCategory not found,  to be appended in categories
                                        let latestProduct = {
                                            "subCategoryId": subCategoryId,
                                            "subCategoryName": sub_category,
                                            "categoryId": categoryId,
                                            "products": product
                                        };
                                        categorySubModel.findOneAndUpdate({ _id: userID },
                                            { $push: { "sub_categories": latestProduct } },
                                            function (err, result) {
                                                if (err) {
                                                    logger.error("saveDatainSubCategory:: Error while pushing first Subcategory for same user", err);
                                                    callback(false);
                                                }
                                                else {//calling pushSubCategoryInHomeConfig
                                                    console.log('calling pushSubCategoryInHomeConfig')
                                                    pushSubCategoryInHomeConfig(userID, categoryId, subCategoryId, sub_category, function (result) {
                                                        if (result) {
                                                            callback(subCategoryId);
                                                        }
                                                        else {
                                                            callback(null);
                                                        }

                                                    });

                                                }
                                            });
                                    }
                                }
                            });
                    }
                    else {
                        let subcatDoc = new categorySubModel();
                        subcatDoc._id = userID;
                        subcatDoc.save(function (err, result) {
                            if (err) {
                                logger.error("saveDatainSubCategory :: Error while adding first Subcategory in the model", err);
                                callback(null);
                            }
                            else {
                                categorySubModel.findByIdAndUpdate({ _id: userID },
                                    { $push: { "sub_categories.0.products": product }, $set: { "sub_categories.0.subCategoryName": sub_category, "sub_categories.0.subCategoryId": subCategoryId, "sub_categories.0.categoryId": categoryId } },
                                    function (err, result) {
                                        if (err) {
                                            logger.error('saveDatainSubCategory :: while adding first subCategory product  ', err);
                                            callback(false);
                                        }
                                        else {
                                            pushSubCategoryInHomeConfig(userID, categoryId, subCategoryId, sub_category, function (result) {
                                                if (result) {
                                                    callback(subCategoryId);
                                                }
                                                else {
                                                    callback(null);
                                                }

                                            });

                                        }
                                    });
                            }
                        });
                    }
                }
            });
    } catch (error) {
        console.log('eRRORRRR', error);
        logger.error('saveDatainSubCategory:: Exception  occurred in creating data in Sub category', error);
        callback(null);
    }
}

//Save data SubSubcategory model for faster landing page for SubSubcategory
function saveDatainSubSubCategory(userID, productId, short_title, categoryId, subCategoryId, sub_sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        categorySubSubModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('saveDatainSubSubCategory:: Error fetching the userId from categorySubModel ', err);
                    callback(false);
                }
                else {
                    let product = {
                        "productId": productId,
                        "short_title": short_title,
                        "attributes": attributes,
                        "gst": gst,
                        "color": color,
                        "isReviewed": isReviewed,
                        "codOption": codOption,
                        "mainImageUrl": mainImageUrl,
                        "otherImages": otherImages
                    };
                    const subSubCategoryId = MUUID.v1().toString();
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        //get the same Sub category for the user
                        categorySubSubModel.findOne({ _id: userID, "sub_sub_categories.subSubCategoryName": sub_sub_category },
                            function (err, result) {
                                if (err) {
                                    logger.error('saveDatainSubSubCategory:: Error while fetching same Subcategory: ', err);
                                    callback(false);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                        categorySubSubModel.findOneAndUpdate({ _id: userID, "sub_sub_categories.subSubCategoryName": sub_sub_category },
                                            { $push: { "sub_sub_categories.$.products": product } }, function (err, result) {
                                                if (err) {
                                                    logger.error('saveDatainSubSubCategory:: Error while fetching updating/pushing SubSubCategory: ', err);
                                                    callback(false);
                                                }
                                                else {
                                                    callback(result['sub_sub_categories'][0].subSubCategoryId);
                                                }
                                            });
                                    }
                                    else {
                                        //SubSubCategory not found,  to be appended in categories
                                        let latestProduct = {
                                            "subSubCategoryId": subSubCategoryId,
                                            "subSubCategoryName": sub_sub_category,
                                            "subCategoryId": subCategoryId,
                                            "categoryId": categoryId,
                                            "products": product
                                        };
                                        console.log('473', latestProduct);
                                        
                                        categorySubSubModel.findOneAndUpdate({ _id: userID },
                                            { $push: { "sub_sub_categories": latestProduct } },
                                            function (err, result) {
                                                if (err) {
                                                    logger.error("saveDatainSubSubCategory:: Error while pushing first SubSubcategory for same user", err);
                                                    callback(false);
                                                }
                                                else {
                                                    pushSubSubCategoryInHomeConfig(userID, categoryId, subCategoryId, subSubCategoryId, sub_sub_category, function(result){
                                                        if(result){
                                                            callback(true);
                                                        }
                                                        else{
                                                            callback(false);
                                                        }
                                                    });
                                                    
                                                }
                                            });
                                    }
                                }
                            });
                    }
                    else {
                        let subSubcatDoc = new categorySubSubModel();
                        subSubcatDoc._id = userID;
                        subSubcatDoc.save(function (err, result) {
                            if (err) {
                                logger.error("saveDatainSubSubCategory :: Error while adding first SubSubcategory in the model", err);
                                callback(false);
                            }
                            else {
                                console.log('Placing first subsub etry', subCategoryId, categoryId);
                                categorySubSubModel.findByIdAndUpdate({ _id: userID },
                                    { $push: { "sub_sub_categories.0.products": product }, $set: { "sub_sub_categories.0.subSubCategoryId": subSubCategoryId, "sub_sub_categories.0.subSubCategoryName": sub_sub_category, "sub_sub_categories.0.subCategoryId": subCategoryId, "sub_sub_categories.0.categoryId": categoryId } },
                                    function (err, result) {
                                        if (err) {
                                            logger.error('saveDatainSubSubCategory :: while adding first subCategory product  ', err);
                                            callback(false);
                                        }
                                        else {
                                            pushSubSubCategoryInHomeConfig(userID, categoryId, subCategoryId, subSubCategoryId, sub_sub_category, function(err, result){
                                                if(err){
                                                    callback(false);
                                                }
                                                else{
                                                    callback(true);
                                                }
                                            });
                                            
                                        }
                                    });
                            }
                        });
                    }
                }
            });
    } catch (error) {
        console.log('eRRORRRR', error);
        logger.error('saveDatainSubSubCategory:: Exception  occurred in creating data in SubSub category', error);
        callback(false);
    }
}

//Save the category its name for Website enu dynamic loading
function pushCategoryInHomeConfig(userID, categoryId, main_category, callback) {
    try {
        homeConfigTheme1Model.findById({ _id: userID }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                let category = {
                    categoryId: categoryId,
                    categoryName: main_category
                };
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                    console.log('category', category);
                    homeConfigTheme1Model.findByIdAndUpdate({ _id: userID },
                        { $push: { 'cat_subCat_subSubCat': category } },
                        function (err, result) {
                            if (err) {
                                callback(false);
                            }
                            else {
                                callback(true);
                            }
                        });
                }
                else {
                    let homeConfig = new homeConfigTheme1Model();
                    homeConfig._id = userID;
                    homeConfig.cat_subCat_subSubCat.push(category);
                    homeConfig.save(function (err, result) {
                        console.log('542', err, result);
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(err)) {
                            console.log('553 ', err);
                            callback(false);
                        }
                        else {
                            callback(true);
                        }
                    });
                }
            }
        })
    } catch (error) {
        logger.error('Error in placing category name in HomeConfig');
        callback(false);
    }
};

//Save Subcategory in Homeconfig
function pushSubCategoryInHomeConfig(userID, categoryId, subCategoryId, sub_category, callback) {
    try {
        let subCategory = {
            subCategoryId: subCategoryId,
            subCategoryName: sub_category
        };
        homeConfigTheme1Model.findOneAndUpdate({ _id: userID, "cat_subCat_subSubCat.categoryId": categoryId },
            { $push: { "cat_subCat_subSubCat.$.sub_categories": subCategory } },
            function (err, result) {
                if (err) {
                    callback(false);
                }
                else {
                    callback(true);
                }
            });
    } catch (error) {
        logger.error('pushSubCategoryInHomeConfig:: Error ', err);
        callback(false);
    }
}

//Save Subcategory in Homeconfig
function pushSubSubCategoryInHomeConfig(userID, categoryId, subCategoryId, subSubCategoryId, sub_sub_category, callback) {
    try {
        let subSubCategory = {
            subSubCategoryId: subSubCategoryId,
            subSubCategoryName: sub_sub_category
        };
        homeConfigTheme1Model.findOne({ _id: userID, 'cat_subCat_subSubCat.categoryId':categoryId},
            function (err, result) {
                result['cat_subCat_subSubCat'][0]['sub_categories'].forEach(function(subsubObj){
                    if(subsubObj['subCategoryId'] == subCategoryId){
                        subsubObj.sub_sub_categories.push(subSubCategory);
                        result.save(function(err, saavedSubSub){
                            subsubObj.save();
                            if(err){
                                callback(false);
                            }
                            else{
                                callback(true);
                            }
                        });
                    }
                });
            });
    } catch (error) {
        console.log('errr 626', err);
        logger.error('pushSubCategoryInHomeConfig:: Error ', err);
        callback(false);
    }
}

function productSaveCategoryWise(data) {
    try {

        console.log(' Maint cat=', JSON.parse(data)["mainImageUrl"]);
        let productSaveCategoryWise_resp = {};
        let main_category = JSON.parse(data).main_category;
        let sub_category = JSON.parse(data).sub_category;
        let sub_sub_category = JSON.parse(data).sub_sub_category;

        let productData = {
            productId: JSON.parse(data)._id,
            title: JSON.parse(data).title,
            price: JSON.parse(data).price,
            mainImage: JSON.parse(data).mainImageUrl,
            userId: JSON.parse(data).userId
        }

        let productMainData = {
            _id: JSON.parse(data)._id,
            userId: JSON.parse(data).userId,
            categories: {}
        }

        let productSubData = {
            _id: JSON.parse(data)._id,
            userId: JSON.parse(data).userId,
            categories: {}
        }

        let productSubSubData = {
            _id: JSON.parse(data).userId,
            userId: JSON.parse(data).userId,
            categories: {}
        }
        console.log('productData ', productData, productSubSubData);
        var cursorMain = categoryMainModel;
        var cursorSub = categorySubModel;
        var cursorSubSub = categorySubSubModel;

        if (!cursorMain) {
            return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
        } else {
            cursorMain.findOne({ _id: data.createrId }, function (err, th) {
                if (!err && th) {
                    if (th.length == 0) {
                        productMainData.categories[main_category] = {
                            _slug: main_category,
                            data: Array(productData)
                        };
                        createMainCategoryProduct(cursorMain, productMainData, function (err, createMainCategoryProductData) { });
                    } else {
                        updateMainCategoryProduct(cursorMain, productData, main_category, function (err, updateMainCategoryProductData) { });
                    }
                } else if (th == null) {
                    productMainData.categories[main_category] = {
                        _slug: main_category,
                        data: Array(productData)
                    };
                    createMainCategoryProduct(cursorMain, productMainData, function (err, createMainCategoryProductData) { });
                }
            });
        }

        if (!cursorSub) {
            return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
        } else {
            cursorSub.findOne({ _id: data.createrId }, function (err, th) {
                if (!err && th) {
                    if (th.length == 0) {
                        productSubData.categories[sub_category] = {
                            _slug: sub_category,
                            data: Array(productData)
                        };
                        createMainCategoryProduct(cursorSub, productSubData, function (err, createMainCategoryProductData) { });
                    } else {
                        updateMainCategoryProduct(cursorSub, productData, sub_category, function (err, updateMainCategoryProductData) { });
                    }
                } else if (th == null) {
                    productSubData.categories[sub_category] = {
                        _slug: sub_category,
                        data: Array(productData)
                    };
                    createMainCategoryProduct(cursorSub, productSubData, function (err, createMainCategoryProductData) { });
                }
            });
        }

        if (!cursorSubSub) {
            return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
        } else {
            cursorSubSub.findOne({ _id: data.createrId }, function (err, th) {
                if (!err && th) {
                    if (th.length == 0) {
                        productSubSubData.categories[sub_sub_category] = {
                            _slug: sub_sub_category,
                            data: Array(productData)
                        };
                        createMainCategoryProduct(cursorSubSub, productSubSubData, function (err, createMainCategoryProductData) { });
                    } else {
                        updateMainCategoryProduct(cursorSubSub, productData, sub_sub_category, function (err, updateMainCategoryProductData) { });
                    }
                } else if (th == null) {
                    productSubSubData.categories[sub_sub_category] = {
                        _slug: sub_sub_category,
                        data: Array(productData)
                    };
                    createMainCategoryProduct(cursorSubSub, productSubSubData, function (err, createMainCategoryProductData) { });
                }
            });
        }

    } catch (error) {
        console.log('Error in updating internal data', error);
    }

}

function createMainCategoryProduct(cursorModel, data, cb) {
    cursorModel.create(data, function (err, docs) {
        if (err) {
            console.log(err)
            return next(new restify.errors.InternalServerError(err));
        } else {
            cb(err, docs);
        }
    });
}

function updateMainCategoryProduct(cursorModel, data, slug, cb) {
    cursorModel.findOne({ _id: data.userId, [`categories.${slug}`]: { $exists: true } }, function (err, th) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            if (th) {
                cursorModel.findOneAndUpdate({ _id: data.userId, [`categories.${slug}`]: { $exists: true } },
                    {
                        $push: { [`categories.${slug}.data`]: data }
                    },
                    function (err, docs) {
                        if (err) {
                            return next(new restify.errors.InternalServerError(err));
                        } else {
                            cb(err, docs);
                        }
                    });
            } else if (th == null) {
                let pData = {
                    $push: { [`categories.${slug}.data`]: data }, [`categories.${slug}._slug`]: slug
                }
                cursorModel.findOneAndUpdate({ _id: data.userId, [`categories`]: { $exists: true } },
                    pData, function (err, docs) {
                        if (err) {
                            return next(new restify.errors.InternalServerError(err));
                        } else {
                            cb(err, docs);
                        }
                    });
            }
        }
    });
}

exports.getProducts = (req, res, next) => {
    // jwt.validateToken;
    // featureChecker.hasAccessToFeatureNew;
    console.log("hhh")
    var cursor = productModel;
    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else {
        cursor.find(function (err, objs) {
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                console.log("objs", objs)
                res.status(200);
                res.send(objs[0].products);
            }
        });
    }
}

exports.getProductsByUserId = function (req, res, next) {
    try {
        let getProductsByUserId_resp = {};
        console.log(req.body);
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        var productId = params.productId;
        var createrId = params.userId;
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body.userId) || !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.page)) {
            let userId = req.body.userId;
            let pageNo = req.body.page;
            let options = {
                select: 'products._id products.title products.short_title products.size products.attributes products.gst products.mainImage products.otherImages products.main_category products.sub_category products.sub_sub_category products.added_date',
                sort: { added_date: -1 },
                page: pageNo,
                limit: 30
            };
            productModel.paginate({ _id: userId }, options, function (err, result) {
                if (err) {
                    console.log('errrrr', err);
                    getProductsByUserId_resp.status = 500;
                    getProductsByUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getProductsByUserId_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getProductsByUserId_resp.status = 200;
                        getProductsByUserId_resp.data = result;
                        res.status(200);
                        res.send(getProductsByUserId_resp);
                    }
                    else {
                        getProductsByUserId_resp.status = 204;
                        getProductsByUserId_resp.data = 'No Content';
                        res.status(204);
                        res.send(getProductsByUserId_resp);
                    }
                }
            });
        }
        else {
            getProductsByUserId_resp.status = 400;
            getProductsByUserId_resp.data = 'BAD Request !';
            res.status(400);
            res.send(getProductsByUserId_resp);
        }
    } catch (error) {
        logger.error('getProductsByUserId:: Error occurred', error);
        console.log('error', error);
        getProductsByUserId_resp.status = 500;
        getProductsByUserId_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(getProductsByUserId_resp);
    }
}

exports.delectProductsById = function (req, res, next) {
    try {
        var queryData = req.body;
        logger.info('Request to delete the product:', queryData);
        let delectProductsById_resp = {};
        let condition = {};
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(queryData.userId) || !check.isUndefinedOrNullOrEmptyOrNoLen(queryData.productId)) {
            let userId = queryData.userId;
            let productId = queryData.productId;
            let main_category = queryData.main_category;
            let sub_category = queryData.sub_category;
            let sub_sub_category = queryData.sub_sub_category;
            productModel.update({ _id: userId },
                { $pull: { "products": { _id: productId } } }, function (err, result) {
                    if (err) {
                        delectProductsById_resp.status = 500;
                        delectProductsById_resp.data = 'Internal Server Error!';
                        res.status(500);
                        res.send(delectProductsById_resp);
                    } else {
                        delectProductsById_resp.status = 200;
                        delectProductsById_resp.data = 'Product Has been deleted!';
                        deleteProductFromCatSubCatSubSubCat(userId, productId, main_category, sub_category, sub_sub_category, function (result) {
                            if (result) {
                                res.status(200);
                                delectProductsById_resp.status = 200;
                                delectProductsById_resp.data = "If you have used this product in Home page, Please delete it manually from Homepage builder"
                                res.send(delectProductsById_resp);
                                // deleteProductfromHomeConfig(userId, productId,function(result){
                                //     if(result){
                                //         res.status(200);
                                //         delectProductsById_resp.status = 200;
                                //         res.send(delectProductsById_resp);
                                //     }
                                //     else{
                                //         res.status(500);
                                //         delectProductsById_resp.status = 200;
                                //         delectProductsById_resp.data = 'Failed to delete from homeconfig, please delete it manuelly from homepagebuilder section';
                                //         res.send(delectProductsById_resp);
                                //     }
                                // });
                            }
                            else {
                                res.status(500);
                                res.status = 500;
                                res.data = 'Failed to delete the product from all category subCategory and Subcategory !';
                                res.send(delectProductsById_resp);
                            }
                        });
                    }
                });
        }
        else {
            delectProductsById_resp.status = 400;
            delectProductsById_resp.data = 'Bad Request!';
            res.status(400);
            res.send(delectProductsById_resp);
        }
    } catch (error) {
        logger.error('Error occurred while deleting the product', error);
        res.status(500);
        delectProductsById_resp.status = 'Failed to delete the product !!';
        res.send(delectProductsById_resp);
    }
};

function deleteProductFromCatSubCatSubSubCat(userId, productId, main_category, sub_category, sub_sub_category, callback) {
    try {
        categoryMainModel.update({ _id: userId, "categories.categoryName": main_category },
            { $pull: { "categories.$.products": { productId: productId } } }, function (err, result) {
                if (err) {
                    logger.error('Error occurred while deleting the Product:', err);
                    callback(false);
                }
                else {
                    categorySubModel.update({ _id: userId, "sub_categories.subCategoryName": sub_category },
                        { $pull: { "sub_categories.$.products": { productId: productId } } }, function (err, result) {
                            if (err) {
                                logger.error('Error occurred while deleting the Product:', err);
                                callback(false);
                            }
                            else {
                                categorySubSubModel.update({ _id: userId, "sub_sub_categories.subSubCategoryName": sub_sub_category },
                                    { $pull: { "sub_sub_categories.$.products": { productId: productId } } }, function (err, result) {
                                        if (err) {
                                            logger.error('Error occurred while deleting the Product:', err);
                                            callback(false);
                                        }
                                        else {
                                            callback(true);
                                        }
                                    });
                            }
                        });
                }
            });
    } catch (error) {
        logger.error('Error while delete the product from Main Category', error);
        callback(false);
    }
}

function deleteProductfromHomeConfig(userId, productId, callback){
    try {
        homeConfigTheme1Model.findById({ _id: userId }, function (err, result) {
            if (err) {
                callback(false);
            }
            else {
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(result['sections'])) {
                    result['sections'].forEach(section => {
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(section['section_1']['products'])) {
                            section['section_1']['products'].forEach(product => {
                                if (product._id == productId) {
                                    console.log('1005', product._id , productId);
                                    // // let index = section['section_1']['products'].indexOf({_id:productId});
                                    // var index = section['section_1']['products'].findIndex(obj => obj._id==productId);
                                    // console.log('index=', index);
                                    // section['section_1']['products'].splice(index,1);
                                    _.remove(section['section_1']['products'], {_id: productId});
                                    result.save(function (err, removedObj) {
                                        if(err){
                                            console.log('Err 1014', err);
                                            callback(true);
                                        }
                                        else{
                                            console.log('removedObj', removedObj);
                                            callback(true);
                                        }
                                    });
                                }
                            });
                        }
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(section['section_2']['products'])) {
                            section['section_2']['products'].forEach(product => {
                                console.log(product, productId);
                                if (product._id == productId) {
                                    console.log('1002', section['section_1']['products'][0]);
                                    var index = section['section_2']['products'].findIndex(obj => obj._id==productId);
                                    section['section_2']['products'].splice(index,1);
                                    result.save(function (err, removedObj) {
                                        if(err){
                                            callback(false);
                                        }
                                        else{
                                            callback(true);
                                        }
                                    });
                                }
                            });
                        }
                        if (!check.isUndefinedOrNullOrEmptyOrNoLen(section['section_3']['products'])) {
                            section['section_3']['products'].forEach(product => {
                                console.log(product, productId);
                                if (product._id == productId) {
                                    var index = section['section_3']['products'].findIndex(obj => obj._id==productId);
                                    section['section_3']['products'].splice(index,1);
                                    result.save(function (err, removedObj) {
                                        if(err){
                                            callback(false);
                                        }
                                        else{
                                            callback(true);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    callback(false);
                }
            }
        });
    } catch (error) {
        logger.error('Error occurred while deleting product from home config', error);
        callback(false);
    }
}


// tag serach data
exports.getTags = (req, res, next) => {
    var cursor = productModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;


    var tagspara = params.tags.toString().split(',');
    // res.send(countryCode);
    console.log(tagspara)
    if (!cursor) {
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        cursor.find({ 'tags.tagName': { $in: tagspara } }, function (err, result) {
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(result);
            }
        });
    }
};

exports.getReviewedProducts = function (req, res) {
    try {
        let getReviewedProducts_resp = {};
        
        var url_data = url.parse(req.url, true);
        var params = url_data.query;
        var userId = params.userId;
        let page = params.page;
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(userId) || !check.isUndefinedOrNullOrEmptyOrNoLen(page)) {

            let  query = {_id: userId};
            let options = {
                select: 'products._id products.title products.short_title products.mainImage products.ratings_reviews products.isReviewed ',
                sort: { added_date: -1 },
                page: page,
                // project: { "products.isReviewed": true,  "products.$.isReviewed": true},
                limit: 1
            };
            productModel.paginate( {_id: userId}, options, function (err, result) {
                if (err) {
                    console.log('errrrr', err);
                    getReviewedProducts_resp.status = 500;
                    getReviewedProducts_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getReviewedProducts_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getReviewedProducts_resp.status = 200;
                        console.log('result', result["docs"][0].products);
                        let filteredData = [];
                        let counter = 0;
                        result["docs"][0].products.forEach(product=>{
                            console.log("Product=", product);
                            if(product["isReviewed"] == true){
                                filteredData.push(product);
                                counter = counter + 1;
                            }
                            else{
                                counter = counter + 1;
                            }
                        });
                        if( counter == result["docs"][0].products.length){
                            getReviewedProducts_resp.data = filteredData;
                            res.send(getReviewedProducts_resp);
                        }
                        
                    }
                    else {
                        getReviewedProducts_resp.status = 204;
                        getReviewedProducts_resp.data = 'No Content';
                        res.status(204);
                        res.send(getReviewedProducts_resp);
                    }
                }
            });
        }
        else {
            getReviewedProducts_resp.status = 400;
            getReviewedProducts_resp.data = 'BAD Request !';
            res.status(400);
            res.send(getReviewedProducts_resp);
        }
    } catch (error) {
        logger.error('getProductsByUserId:: Error occurred', error);
        console.log('error', error);
        getReviewedProducts_resp.status = 500;
        getReviewedProducts_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(getReviewedProducts_resp);
    }
}

//Update /approve Reviews

exports.updateReviewedProducts = function (req, res) {
    let updateReviewedProducts_resp = {}
    try {
        let createrId = req.body["userId"];
        let rnrId = req.body["rnrId"];
        let productId = req.body["productId"];
        productModel.findOne({ _id: createrId },
            function (err, result) {
                if (err) {
                    console.log('err 1341', err)
                    updateReviewedProducts_resp.status = 500;
                    updateReviewedProducts_resp.status = 'Internal server Error';
                    res.send(updateReviewedProducts_resp)
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result["products"])) {
                        result["products"].forEach(product => {
                            if (product["_id"] == productId) {
                                product.ratings_reviews.forEach(rnr => {
                                    if (rnr["_id"] == rnrId) {
                                        rnr.isReviewApproved = true;
                                        result.save(function (err, result) {
                                            if (err) {
                                                updateReviewedProducts_resp.status = 500;
                                                updateReviewedProducts_resp.data = 'Failed to Approve the Review';
                                                res.send(updateReviewedProducts_resp);
                                            }
                                            else {
                                                updateReviewedProducts_resp.status = 200;
                                                updateReviewedProducts_resp.data = 'Successfully Approved the Review, Now this will be publically available on your Website';
                                                res.send(updateReviewedProducts_resp);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        updateReviewedProducts_resp.status = 200;
                        updateReviewedProducts_resp.status = 'Product not found';
                        res.send(updateReviewedProducts_resp);
                    }
                }
            });
    } catch (error) {
        console.log('Error', error);
        updateReviewedProducts_resp.status = 500;
        updateReviewedProducts_resp.status = 'Internal server Error';
        res.send(updateReviewedProducts_resp)
    }
}

exports.updatePosition = (req, res, next) => {
    let id = req.body.id
    let pos = req.body.pos
    articleHome.findOneAndUpdate({ '_id': id }, { "$set": { "pos": pos, } },
        function (err, doc) {
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send('Article Home Updated');
                next();
            }
        });
};

let articlesTypes = [
    { type: "Visual arts", sub_categories: 'sub_channel', sub_channel_name: ['Fairs', 'Auctions', 'Galleries', 'Museums', 'Columnist', 'Features'], sub_sub_categories: 'sub_subs', sub_sub_channel_names: ['News', 'Previews', 'Reviews', 'Parties', 'Videos'] },
    { type: "Architecture design", sub_categories: 'ArchitectureChannels', sub_channel_name: ['Architecture', 'Design', 'Home & Interiors'], sub_sub_categories: 'ArchitectureSubs', sub_sub_channel_names: ['News', 'Reviews', 'Video'] },
    { type: "Performance & arts", sub_categories: 'PerformanceChannels', sub_channel_name: ['Film', 'Music', 'Television', 'Theatre & Dance'], sub_sub_categories: 'PerformanceSubs', sub_sub_channel_names: ['News', 'Reviews', 'Video', 'Parties'] },
    { type: "Lifestyle", sub_categories: 'LifesytlesChannels', sub_channel_name: ['Food & Wine', 'Jewelry & Watches', 'Autos & Boats', 'Auctions'], sub_sub_categories: 'LifesytlesSubs', sub_sub_channel_names: ['News', 'Video', 'Parties'] },
    { type: "Fashion", sub_categories: 'FashionChannels', sub_channel_name: ['Designer Spotlight', 'Runway', 'Style Guide', 'Accessories', 'Exhibitions'], sub_sub_categories: 'FashionSubs', sub_sub_channel_names: ['News', 'Reviews', 'Video', 'Parties'] },
    { type: "Travel", sub_categories: 'TravelChannels', sub_channel_name: ['Inspiration', 'Destinations', 'People'], sub_sub_categories: 'TravelSubs', sub_sub_channel_names: ['Cultural Experiences', 'Hotels & Resorts', 'Shopping', 'Food & Wine', 'When In', 'Cue the Concierge', 'The Resident', 'The Venturer', ' Mr. Tripper'] },
    // {type: "Books",sub_categories:'Books'},
];

exports.latestRecords = (req, res, next) => {
    let CountryType = req.body.country;
    let Data = {};
    articlesTypes.forEach((types, index) => {
        let condtion = {};
        //Data['CountryCode'] = CountryType;
        //condtion[`All_country.0.${CountryType}`] = true;
        condtion['category_type_article'] = types.type;
        let Projection = {
            title: 1,
            short_title: 1,
            article_page: 1,
            summary: 1,
            Published: 1,
            category_type_article: 1,
            'files.uploadFiles': 1,
            added_date: 1,
            author_article: 1
        };
        Projection[`${types.sub_categories}`] = 1;

        productModel.find(condtion, Projection).lean(true).limit(4).sort({ $natural: -1 }).exec((err, doc) => {
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                let sub_categories = types.sub_channel_name;
                Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')] = {};
                if (types.type == "Visual arts") {
                    Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')]['art_mrkt_news'] = [];
                }
                doc.forEach((docItems, docIndex) => {
                    doc[docIndex]['ArticleId'] = docItems._id;
                    // console.log(doc[docIndex])

                    for (var Key of sub_categories) {
                        //console.log(docItems[`${types.sub_categories}`][0],' --- > ',docItems[`${types.sub_categories}`][0][Key])
                        if (docItems[`${types.sub_categories}`][0][Key]) {
                            doc[docIndex]['sub_cat_label'] = Key;
                            //console.log(doc[docIndex]['sub_cat_label']);
                            Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')]['latestArticle'] = doc;
                            break;
                        }
                    }
                })


                sub_categories.forEach((subCategoriesItems, subCategoriesIndex) => {

                    let condition2 = Object.assign({}, condtion)
                    condition2[`${types.sub_categories}.0.${subCategoriesItems}`] = true;
                    productModel.find(condition2, {
                        title: 1,
                        short_title: 1,
                        summary: 1,
                        category_type_article: 1,
                        'files.uploadFiles': 1,
                        added_date: 1,
                        author_article: 1
                    }).lean(true).limit(3).sort({ $natural: -1 }).exec((subErr, subDoc) => {
                        if (subErr) {
                            return next(new restify.errors.InternalServerError(subErr));
                        } else {
                            subDoc.forEach((subDocItems, subDocItemIndex) => {
                                subDoc[subDocItemIndex]["ArticleId"] = subDocItems._id;
                                subDoc[subDocItemIndex]['sub_cat_label'] = subCategoriesItems
                            })
                            Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')][subCategoriesItems.replace(/\s\&/i, '').trim().replace(/\s/g, '_')] = subDoc;


                            if (subCategoriesIndex == sub_categories.length - 1) {
                                let SlideShowProjection = { title: 1, shortTitle: 1, 'files.uploadFiles': 1, _id: 0, category_type_article: 1, ArchitectureChannels: 1, PerformanceChannels: 1, LifesytlesChannels: 1, FashionChannels: 1, TravelChannels: 1, TravelSubs: 1, sub_channel: 1 };
                                SlideShowProjection[`${types.sub_categories}`] = 1

                                slideShowModel.find(condtion, SlideShowProjection).lean(true).limit(3).sort({ $natural: -1 }).exec((slideShowErr, slideShowDoc) => {

                                    if (slideShowErr) {
                                        return next(new restify.errors.InternalServerError(slideShowErr));
                                    } else {
                                        slideShowDoc.forEach((slideShowloop, slideShowIndex) => {
                                            slideShowDoc[slideShowIndex]['sub_cat_label'] = slideShowloop[`${types.sub_categories}`]
                                        })
                                        Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')]['SlideShow'] = slideShowDoc;

                                        let eventProjection = { title: 1, 'files.main_events_photos': 1, _id: 0, field_entity_profile_location: 1, category_type_article: 1, sub_channel: 1, PerformanceChannels: 1, LifesytlesChannels: 1, ArchitectureChannels: 1 };
                                        eventProjection[`${types.sub_categories}`] = 1
                                        eventsModel.find(condtion, eventProjection).lean(true).limit(4).sort({ $natural: -1 }).exec((eventErr, eventDoc) => {
                                            console.log('Event -->', eventDoc);
                                            if (eventErr) {
                                                return next(new restify.errors.InternalServerError(eventErr));
                                            } else {
                                                eventDoc.forEach((eventLoop, eventIndex) => {
                                                    eventDoc[eventIndex]['sub_cat_label'] = eventLoop[`${types.sub_categories}`]
                                                })
                                                Data[types.type.replace(/\s\&/i, '').trim().replace(/\s/g, '_')]['Event'] = eventDoc;
                                                console.log('data -->', Data)
                                                console.log(index, '------->', articlesTypes.length, '------->', subCategoriesIndex, '------->', sub_categories.length - 1, '-------->', (index == articlesTypes.length - 1) && (subCategoriesIndex == Object.keys(sub_categories).length - 1))
                                                if ((index == articlesTypes.length - 1) && (subCategoriesIndex == sub_categories.length - 1)) {
                                                    //res.send(Data)
                                                    // Find the document
                                                    categoryTypeModel.findOneAndUpdate({}, Data, function (error, result) {
                                                        if (error) {
                                                            return next(new restify.errors.InternalServerError(err));
                                                        } else {
                                                            if (result) {
                                                                //  res.send();
                                                                var update_id = result._id
                                                                categoryTypeModel.findByIdAndUpdate({ '_id': update_id }, Data, function (error, updateData) {
                                                                    if (error) {
                                                                        return next(new restify.errors.InternalServerError(err));
                                                                    } else {
                                                                        res.status(200);
                                                                        console.log(updateData);
                                                                        setArtMarketNews(update_id)
                                                                        res.send({ "result": updateData });
                                                                    }
                                                                })

                                                            } else {
                                                                categoryTypeModel.create(Data, (err, insertedData) => {
                                                                    if (err) {
                                                                        return next(new restify.errors.InternalServerError(err));
                                                                    } else {
                                                                        res.status(200);
                                                                        setArtMarketNews(insertedData._id)
                                                                        res.send(insertedData);

                                                                    }
                                                                })
                                                            }
                                                        }

                                                        // do something with the document
                                                    });



                                                }


                                            }
                                        })


                                    }
                                })
                            }

                        }

                    })
                });


            }
        });
    });
};


function setArtMarketNews(dataId) {
    let condtion = {
        $or: [{ 'sub_channel.0.Fairs': true }, { 'sub_channel.0.Galleries': true },
        { 'sub_channel.0.Auctions': true }], 'sub_subs.0.News': true
    }
    let Projection = {
        title: 1,
        short_title: 1,
        article_page: 1,
        summary: 1,
        Published: 1,
        category_type_article: 1,
        'files.uploadFiles': 1,
        added_date: 1,
        author_article: 1
    };
    Projection[`sub_channel`] = 1;
    productModel.find(condtion, Projection).lean(true).limit(3).sort({ $natural: -1 }).exec((err, doc) => {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            console.log('ssssssssssssssss------------>,', doc)
            doc.forEach((docItems, docIndex) => {
                doc[docIndex]['ArticleId'] = docItems._id;
                for (var Key of articlesTypes[0].sub_channel_name) {
                    if (docItems[`sub_channel`][0][Key]) {
                        doc[docIndex]['sub_cat_label'] = Key;
                        break;
                    }
                }
            })
            productModel.find({ 'sub_subs.0.Reviews': true }).lean(true).limit(3).sort({ $natural: -1 }).exec((reviewErr, reviewDoc) => {
                if (err) {
                    return next(new restify.errors.InternalServerError(err));
                } else {
                    reviewDoc.forEach((docItems, docIndex) => {
                        reviewDoc[docIndex]['ArticleId'] = docItems._id;
                        for (var Key of articlesTypes[0].sub_channel_name) {
                            if (docItems[`sub_channel`][0][Key]) {
                                reviewDoc[docIndex]['sub_cat_label'] = Key;
                                break;
                            }
                        }
                    })
                    categoryTypeModel.findOneAndUpdate({ _id: dataId }, { $set: { 'Visual_arts.art_mrkt_news': doc, 'Visual_arts.Reviews': reviewDoc } }, function (error, updateData) {
                        if (error) {
                            return next(new restify.errors.InternalServerError(err));
                        } else {

                            console.log("updateData ------->", dataId);

                        }
                    })
                }
            });

        }
    })
}

//Most popular api for article details page
let mostpopularArticleLoop = [
    { type: 'current_date_most_popular', value: 1 },
    { type: 'current_week_most_popular', value: 7 },
    { type: 'current_month_most_popular', value: 31 },
    { type: 'all_time_most_popular_article', value: null }
]

exports.MostPopularArticle = function (req, res, next) {
    var cursor = productModel;
    var params = req.body;
    if (!cursor) {
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        let Projection = {
            title: 1,
            views: 1,
            Published: 1,
            'files.uploadFiles': 1,
            author_article: 1,
            short_title: 1,
            summary: 1,
            category_type_article: 1,

        }
        mostpopularArticleLoop.forEach((item, index) => {

            // console.log(index + '.' + item);
            let condition;
            if (item.value) {
                condition = { added_date: { $gte: new Date(new Date().setDate(new Date().getDate() - item.value)) }, views: { $gte: 0 } }
            } else {
                condition = { views: { $gte: 0 } };
            }
            // res.send(condition);
            cursor.find(condition, Projection).lean(true).sort({ $natural: -1 }).limit(6).exec((err, doc) => {
                if (err) {
                    return next(new restify.errors.InternalServerError(err));
                } else {
                    if (doc.length != 0) {
                        doc.forEach((docItem, docIndex) => {
                            doc[docIndex]['articleId'] = docItem._id;
                        })
                        let SetCondition = { $set: {} };
                        SetCondition['$set'][`${item.type}`] = doc;
                        //   res.send(SetCondition);
                        articleDetailsModels.findOneAndUpdate(SetCondition).exec((updateErr, updateDoc) => {
                            if (updateErr) {
                                return next(new restify.errors.InternalServerError(updateErr));
                            } else {
                                if (updateDoc) {
                                    res.status(200);
                                    res.send({ "result": " Data is updated now" });
                                } else {
                                    var rs = {};
                                    rs[`${item.type}`] = doc
                                    articleDetailsModels.create(rs, function (inserterr, mostarticle) {
                                        if (inserterr) {
                                            return next(new restify.errors.InternalServerError(inserterr));
                                        } else {
                                            res.status(200);
                                            res.send({ "result": " Data is saved now" });
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            });
        });



    }

}

exports.testing = (req, res) => {
    //updateRecommendedArtistsinArticle(req.body);
}

exports.updateRecommendedArtistsinArticle = (data) => {
    if (data) {
        console.log(data);
        let condition = {};
        condition['artistData.0.nationality'] = data.nationality;
        condition['artistData.0.field_specialties'] = { $in: data.field_specialties }
        let artistConsition = {};
        artistConsition['field_specialties'] = { $in: data.field_specialties }
        artistConsition['nationality'] = data.nationality;;
        productModel.find(condition).lean(true).exec((err, doc) => {
            if (err) {
                console.log('err', err);
            } else {
                if (doc.length > 0) {
                    for (let i = 0; i < doc.length; i++) {
                        RecommendedArtist(artistConsition, doc[i]._id);
                    }
                }
            }
        })
    }
}
function RecommendedThingsInArticle(data) {
    if (data) {
        let recommendedArticlesCondition = {};
        let recommendedSlideShowCondition = {};
        let recommendedEventCondition = {};
        let recommendedArtistCondition = {};

        let selectedType = null;
        for (let i = 0; i < articlesTypes.length; i++) {
            if (data.category_type_article == articlesTypes[i].type) {
                selectedType = articlesTypes[i];
                recommendedArticlesCondition['category_type_article'] = selectedType.type;
                recommendedSlideShowCondition['category_type_article'] = selectedType.type;
                recommendedEventCondition['category_type_article'] = selectedType.type;
                break;
            }
        }
        for (let i = 0; i < selectedType['sub_channel_name'].length; i++) {
            if (data[`${selectedType['sub_categories']}`][0][`${selectedType['sub_channel_name'][i]}`]) {
                recommendedArticlesCondition[`${selectedType['sub_categories']}.0.${selectedType['sub_channel_name'][i]}`] = true;
                recommendedSlideShowCondition[`${selectedType['sub_categories']}.0.${selectedType['sub_channel_name'][i]}`] = true;
                if (recommendedEventCondition) {
                    var sub_channel_section_all = ['Fairs', 'Auctions', 'Galleries', 'Museums'];
                    var events_sub_channel = ['Art Fairs', 'Auctions', 'Gallery Shows', 'Museum Exhibitions'];
                    if (sub_channel_section_all === events_sub_channel) {
                        recommendedEventCondition[`${selectedType['sub_categories']}.0.${selectedType['sub_channel_name'][i]}`] = true;
                    }
                }
                break;
            }
        }
        for (let i = 0; i < selectedType['sub_sub_channel_names'].length; i++) {
            if (data[`${selectedType['sub_sub_categories']}`][0][`${selectedType['sub_sub_channel_names'][i]}`]) {
                recommendedArticlesCondition[`${selectedType['sub_sub_categories']}.0.${selectedType['sub_sub_channel_names'][i]}`] = true;
                //recommendedSlideShowCondition[`${selectedType['sub_sub_categories']}.0.${selectedType['sub_sub_channel_names'][i]}`] = true;
                break;
            }
        }
        let specailitys = [];
        data["artistData"][0]["field_specialties"].forEach(specialityitems => {
            specailitys.push(specialityitems);
        })
        //recommendedArtistCondition = `{field_specialties:{$in:[${data['artistData'][0]['field_specialties']}]},nationality:${data['artistData'][0]["nationality"].toString()}}`
        recommendedArtistCondition['field_specialties'] = { $in: specailitys }
        recommendedArtistCondition['nationality'] = data['artistData'][0]["nationality"].toString();
        console.log("recommendedArtistCondition ---> ", recommendedArtistCondition)

        let selectedTags = []
        data.tags.forEach(tagItems => {
            selectedTags.push(tagItems.tagName);
        });
        recommendedArticlesCondition[`tags.tagName`] = { $in: selectedTags }
        //console.log(recommendedArticlesCondition);

        console.log('recommendedArticlesCondition -->', recommendedArticlesCondition);
        console.log('recommendedSlideShowCondition -->', recommendedSlideShowCondition)
        console.log('recommendedEventCondition -->', recommendedEventCondition)
        RecommendedArticle(recommendedArticlesCondition, data._id);
        RecommendedSlideShow(recommendedSlideShowCondition, data._id);
        RecommendedEvent(recommendedEventCondition, data._id);
        RecommendedArtist(recommendedArtistCondition, data._id);

    }
}


function RecommendedArticle(data, id) {
    if (data) {
        productModel.find(data).lean(true).limit(3).sort({ $natural: 1 }).exec((err, doc) => {
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                if (doc.length != 0) {
                    console.log("docdocdocdocdocdocdocdoc......", doc)
                    productModel.findOneAndUpdate({ _id: id }, { $set: { automaticRecommendedArticles: doc } }).exec((updateErr, updateDoc) => {
                        if (updateErr) {
                            return next(new restify.errors.InternalServerError(err));
                        } else {
                            //console.log('Article Recommended',updateDoc)
                        }
                    });
                }
            }

        });
    }
}

function RecommendedSlideShow(data, id) {
    slideShowModel.find(data).lean(true).limit(3).sort({ $natural: -1 }).exec((err, doc) => {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            if (doc.length != 0) {
                productModel.findOneAndUpdate({ _id: id }, { $set: { automaticRecommendedSlideShow: doc } }).exec((updateErr, updateDoc) => {
                    if (updateErr) {
                        return next(new restify.errors.InternalServerError(err));
                    } else {
                        //console.log('slideShow Recommended',updateDoc)
                    }
                });
            }
        }
    });
}
function RecommendedEvent(data, id) {
    eventsModel.find(data).lean(true).limit(4).sort({ $natural: -1 }).exec((err, doc) => {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            if (doc.length != 0) {
                productModel.findOneAndUpdate({ _id: id }, { $set: { automaticRecommendedEvent: doc } }).exec((updateErr, updateDoc) => {
                    if (updateErr) {
                        return next(new restify.errors.InternalServerError(err));
                    } else {
                        //console.log('event Recommended',updateDoc)
                    }
                });
            }
        }
    });
}

function RecommendedArtist(data, id) {
    artistModel.find(data).lean(true).limit(4).sort({ $natural: -1 }).exec((err, doc) => {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            console.log('artist Recommended', doc)
            if (doc.length != 0) {
                productModel.findOneAndUpdate({ _id: id }, { $set: { automaticRecommendedArtist: doc } }).exec((updateErr, updateDoc) => {
                    if (updateErr) {
                        return next(new restify.errors.InternalServerError(err));
                    } else {
                        //console.log('artist Recommended',updateDoc)
                    }
                });
            }
        }
    });
}


// get product by ProductId and UserId
exports.getProductsByProductIdUserId = function (req, res, next) {
    try {
        let getProductsByProductIdUserId_resp = {};
        console.log(req.body);
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(req.body.userId) || !check.isUndefinedOrNullOrEmptyOrNoLen(req.body.page)) {
            let userId = req.body.userId;
            let productId = req.body.productId;
            let pageNo = req.body.page;
            let options = {
                select: 'products._id products.title products.short_title products.size products.price products.mainImage products.otherImages products.main_category products.sub_category products.sub_sub_category products.added_date',
                sort: { added_date: -1 },
                page: pageNo,
                limit: 30
            };
            productModel.findOne({ _id: userId},  { "products": { $elemMatch: { _id: productId }}},
             function (err, result) {
                 console.log(result);
                if (err) {
                    console.log('errrrr', err);
                    getProductsByProductIdUserId_resp.status = 500;
                    getProductsByProductIdUserId_resp.data = 'Internal Server Error';
                    res.status(500);
                    res.send(getProductsByProductIdUserId_resp);
                }
                else {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        getProductsByProductIdUserId_resp.status = 200;
                        getProductsByProductIdUserId_resp.data = result;
                        res.status(200);
                        res.send(getProductsByProductIdUserId_resp);
                    }
                    else {
                        getProductsByProductIdUserId_resp.status = 204;
                        getProductsByProductIdUserId_resp.data = 'No Content';
                        res.status(204);
                        res.send(getProductsByProductIdUserId_resp);
                    }
                }
            });
        }
        else {
            getProductsByProductIdUserId_resp.status = 400;
            getProductsByProductIdUserId_resp.data = 'BAD Request !';
            res.status(400);
            res.send(getProductsByProductIdUserId_resp);
        }
    } catch (error) {
        logger.error('getProductsByUserId:: Error occurred', error);
        console.log('error', error);
        getProductsByProductIdUserId_resp.status = 500;
        getProductsByProductIdUserId_resp.data = 'Internal Server error !';
        res.status(500);
        res.send(getProductsByProductIdUserId_resp);
    }
}