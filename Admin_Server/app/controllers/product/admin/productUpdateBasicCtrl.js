var path = require('path');
var restify = require('restify');
var productModel = require('mongoose').model('Product');
var categoryMainModel = require('mongoose').model('categoryMain');
var categorySubModel = require('mongoose').model('categorySub');
var categorySubSubModel = require('mongoose').model('categorySubSub');
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var _ = require('lodash');
var url = require('url');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { chownSync } = require('fs');
var logger = require('logger').createLogger();
const MUUID = require('uuid-mongodb');
const { contextsKey } = require('express-validator/src/base');
var check = require(path.join(__dirname, '..', '..', '..', 'service', 'util', 'checkValidObject'));


exports.updateProduct = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let createProduct_resp = {};
            createProduct_resp.status = 422;
            createProduct_resp.data = errors;
            // res.status(422);
            res.send(createProduct_resp);
        }
        else {
            let createProduct_resp = {};
            let productInputData = req.body;
            console.log(productInputData);

            let formattedProdData = formatProductUpdateData(productInputData, req);
            
            productModel.findOneAndUpdate({ _id: formattedProdData.createrId, "products._id": formattedProdData._id },
                { $set: { "products.$": formattedProdData } },
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
                            updateProductinCatSubcatSubSubCat(formattedProdData, res);
                        } else {
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

function formatProductUpdateData(articleData, req) {
    console.log("formatProductUpdateData....", articleData);
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
function updateProductinCatSubcatSubSubCat(productData, res) {
    let productSaveCategoryWise_Resp = {};
    try {
        if (!check.isUndefinedOrNullOrEmptyOrNoLen(productData.createrId) && productData._id) {
            let userID = productData.createrId;
            let productId = productData._id;
            let main_category = productData.main_category;
            let sub_category = productData.sub_category;
            let sub_sub_category = productData.sub_sub_category;
            let mainImageUrl = productData.mainImage[0].location;
            let otherImages;
            if (!check.isUndefinedOrNullOrEmptyOrNoLen(productData.otherImages)) {
                let otherImageUrl = [];
                productData.otherImages.forEach(image => {
                    otherImageUrl.push(image.location);
                });
                otherImages = otherImageUrl
            }

            let short_title = productData.short_title;
            let color = productData.color;
            let isReviewed = productData.isReviewed;
            let codOption = productData.codOption;
            let attributes = productData.attributes;
            let gst = productData.gst;

            updateDatainMainCategory(userID, productId, short_title, main_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (categoryId) {
                console.log('categoryId=', categoryId);
                if (!check.isUndefinedOrNullOrEmptyOrNoLen(categoryId)) {
                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(sub_category)) {
                        updateDatainSubCategory(userID, productId, short_title, categoryId, sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (subCategoryId) {
                            if (!check.isUndefinedOrNullOrEmptyOrNoLen(subCategoryId)) {
                                if (!check.isUndefinedOrNullOrEmptyOrNoLen(sub_sub_category)) {
                                    updateDatainSubSubCategory(userID, productId, short_title, categoryId, subCategoryId, sub_sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, function (subSubCategoryId) {
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
function updateDatainMainCategory(userID, productId, short_title, main_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        console.log('main_category', main_category);
        categoryMainModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('updateDatainMainCategory:: Error fetching the userId from categoryMainModel ', err);
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
                            // { "categories": { $elemMatch: { categoryName: main_category } } },
                            function (err, result) {

                                if (err) {
                                    logger.error('updateDatainMainCategory:: Error while fetching same category: ', err);
                                    callback(null);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                        result['categories'].forEach(categorie => {
                                            if (categorie['categoryName'] == main_category) {
                                                categorie['products'].forEach(productD => {
                                                    if (productD["productId"] == productId) {
                                                        productD["mainImageUrl"] = mainImageUrl;
                                                        productD["otherImages"] = otherImages;
                                                        productD["attributes"] = attributes;
                                                        productD["short_title"] = short_title;
                                                        productD["gst"] = gst;
                                                        productD["codOption"] = codOption;
                                                        productD["isReviewed"] = isReviewed;
                                                        productD["color"] = color;

                                                        result.save(function (err, result) {
                                                            if (err) {
                                                                logger.error('updateDatainMainCategory:: Error while fetching updating/pushing category: ', err);
                                                                callback(null);
                                                            }
                                                            else {
                                                                console.log("saved main category")
                                                                callback(categorie['categoryId']);
                                                            }
                                                        });
                                                    }

                                                });
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
                                                    logger.error("updateDatainMainCategory:: Error while pushing in  category for same user", err);
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
                                logger.error("updateDatainMainCategory :: Error while adding first category in the model", err);
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
        logger.error('updateDatainMainCategory:: Exception  occurred in creating data in Main category', error);
        callback(null);
    }
}

//Save data Subcategory model for faster landing page for Subcategory
function updateDatainSubCategory(userID, productId, short_title, categoryId, sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        categorySubModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('updateDatainSubCategory:: Error fetching the userId from categorySubModel ', err);
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
                                    logger.error('updateDatainSubCategory:: Error while fetching same Subcategory: ', err);
                                    callback(false);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                                        result['sub_categories'].forEach(categorie => {
                                            if (categorie['subCategoryName'] == sub_category) {
                                                categorie['products'].forEach(productD => {
                                                    if (productD["productId"] == productId) {
                                                        productD["mainImageUrl"] = mainImageUrl;
                                                        productD["otherImages"] = otherImages;
                                                        productD["attributes"] = attributes;
                                                        productD["short_title"] = short_title;
                                                        productD["gst"] = gst;
                                                        productD["codOption"] = codOption;
                                                        productD["isReviewed"] = isReviewed;
                                                        productD["color"] = color;

                                                        result.save(function (err, result) {
                                                            if (err) {
                                                                logger.error('updateDatainSubCategory:: Error while fetching updating/pushing category: ', err);
                                                                callback(null);
                                                            }
                                                            else {
                                                                console.log("saved sub category")
                                                                callback(categorie['subCategoryId']);
                                                            }
                                                        });
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
                                                    logger.error("updateDatainSubCategory:: Error while pushing first Subcategory for same user", err);
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
                                logger.error("updateDatainSubCategory :: Error while adding first Subcategory in the model", err);
                                callback(null);
                            }
                            else {
                                categorySubModel.findByIdAndUpdate({ _id: userID },
                                    { $push: { "sub_categories.0.products": product }, $set: { "sub_categories.0.subCategoryName": sub_category, "sub_categories.0.subCategoryId": subCategoryId, "sub_categories.0.categoryId": categoryId } },
                                    function (err, result) {
                                        if (err) {
                                            logger.error('updateDatainSubCategory :: while adding first subCategory product  ', err);
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
        logger.error('updateDatainSubCategory:: Exception  occurred in creating data in Sub category', error);
        callback(null);
    }
}

//Save data SubSubcategory model for faster landing page for SubSubcategory
function updateDatainSubSubCategory(userID, productId, short_title, categoryId, subCategoryId, sub_sub_category, mainImageUrl, otherImages, attributes, gst, color, isReviewed, codOption, callback) {
    try {
        categorySubSubModel.findById({ _id: userID },
            function (err, result) {
                if (err) {
                    logger.error('updateDatainSubSubCategory:: Error fetching the userId from categorySubModel ', err);
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
                                    logger.error('updateDatainSubSubCategory:: Error while fetching same Subcategory: ', err);
                                    callback(false);
                                }
                                else {
                                    if (!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {

                                        result['sub_sub_categories'].forEach(categorie => {
                                            if (categorie['subSubCategoryName'] == sub_sub_category) {
                                                categorie['products'].forEach(productD => {
                                                    if (productD["productId"] == productId) {
                                                        productD["mainImageUrl"] = mainImageUrl;
                                                        productD["otherImages"] = otherImages;
                                                        productD["attributes"] = attributes;
                                                        productD["short_title"] = short_title;
                                                        productD["gst"] = gst;
                                                        productD["codOption"] = codOption;
                                                        productD["isReviewed"] = isReviewed;
                                                        productD["color"] = color;

                                                        result.save(function (err, result) {
                                                            if (err) {
                                                                logger.error('updateDatainSubSubCategory:: Error while fetching updating/pushing category: ', err);
                                                                callback(null);
                                                            }
                                                            else {
                                                                console.log("saved sub sub category")
                                                                callback(categorie['subSubCategoryId']);
                                                            }
                                                        });
                                                    }

                                                });
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
                                                    logger.error("updateDatainSubSubCategory:: Error while pushing first SubSubcategory for same user", err);
                                                    callback(false);
                                                }
                                                else {
                                                    pushSubSubCategoryInHomeConfig(userID, categoryId, subCategoryId, subSubCategoryId, sub_sub_category, function (result) {
                                                        if (result) {
                                                            callback(true);
                                                        }
                                                        else {
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
                                logger.error("updateDatainSubSubCategory :: Error while adding first SubSubcategory in the model", err);
                                callback(false);
                            }
                            else {
                                console.log('Placing first subsub etry', subCategoryId, categoryId);
                                categorySubSubModel.findByIdAndUpdate({ _id: userID },
                                    { $push: { "sub_sub_categories.0.products": product }, $set: { "sub_sub_categories.0.subSubCategoryId": subSubCategoryId, "sub_sub_categories.0.subSubCategoryName": sub_sub_category, "sub_sub_categories.0.subCategoryId": subCategoryId, "sub_sub_categories.0.categoryId": categoryId } },
                                    function (err, result) {
                                        if (err) {
                                            logger.error('updateDatainSubSubCategory :: while adding first subCategory product  ', err);
                                            callback(false);
                                        }
                                        else {
                                            pushSubSubCategoryInHomeConfig(userID, categoryId, subCategoryId, subSubCategoryId, sub_sub_category, function (err, result) {
                                                if (err) {
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
                    }
                }
            });
    } catch (error) {
        console.log('eRRORRRR', error);
        logger.error('updateDatainSubSubCategory:: Exception  occurred in creating data in SubSub category', error);
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
        homeConfigTheme1Model.findOne({ _id: userID, 'cat_subCat_subSubCat.categoryId': categoryId },
            function (err, result) {
                result['cat_subCat_subSubCat'][0]['sub_categories'].forEach(function (subsubObj) {
                    if (subsubObj['subCategoryId'] == subCategoryId) {
                        subsubObj.sub_sub_categories.push(subSubCategory);
                        result.save(function (err, saavedSubSub) {
                            subsubObj.save();
                            if (err) {
                                callback(false);
                            }
                            else {
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
