var restify = require('restify');
var path = require('path');
var logger = require('logger').createLogger();
var path = require('path');
var mongoose = require('mongoose');
var productModel = require('mongoose').model('Product');
var homeConfigTheme1Model = require('mongoose').model('homeConfigTheme1');
var check = require(path.join(__dirname, '..', '..', 'service', 'util', 'checkValidObject'));
var s3_ver = require(path.join(__dirname, '..', '..', 'global', 'config', 's3Config'));
var aws = require('aws-sdk');
var url = require('url');
var Bluebird = require("bluebird");

aws.config.update({
    secretAccessKey: s3_ver.secretAccessKey,
    accessKeyId: s3_ver.accessKeyId,
    region: s3_ver.region
});
var s3 = new aws.S3();

exports.updateproduct = function (req, res, next){
    try {
        let updateproduct_resp = {};
        var productData = req.body;
        console.log('productData=', req.files['mainImage'] );

        if (!productModel)
            return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
        else{
            console.log('productData.userId', productData.userId);
            productModel.findOneAndUpdate({_id:productData.userId, "products._id": productData._id },
            {$set:{"products.$.mainImage" : req.files['mainImage'] ? req.files['mainImage'] : null, "products.$.otherImages": req.files['otherImages'] ? req.files['otherImages'] : null }},
            function(err, result){
               if(err){
                    console.log('error', err);
                    updateproduct_resp.status = 300;
                    updateproduct_resp.data = 'Not Modified';
                    res.send(updateproduct_resp);

                }
                else{
                    let cat_sub_subsubData = {};
                    let latestProduct = result['products'].pop();
                    cat_sub_subsubData.title = latestProduct.title;
                    cat_sub_subsubData.short_title = latestProduct.short_title;
                    cat_sub_subsubData.main_category = latestProduct.main_category;
                    cat_sub_subsubData.sub_category = latestProduct.sub_category;
                    cat_sub_subsubData.sub_sub_category = latestProduct.sub_sub_category;
                    // cat_sub_subsubData.price = latestProduct.price;
                    cat_sub_subsubData.color = latestProduct.color;
                    cat_sub_subsubData.isReviewed = latestProduct.isReviewed;
                    cat_sub_subsubData.codOption = latestProduct.codOption;
                    // cat_sub_subsubData.weight = latestProduct.weight;
                    cat_sub_subsubData.mainImageUrl =req.files['mainImage'][0].location;
                    cat_sub_subsubData.attributes = latestProduct.attributes;
                    cat_sub_subsubData.gst = latestProduct.gst;
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(req.files['otherImages'])){
                        let otherImageUrl = [];
                        req.files['otherImages'].forEach(image=>{
                            otherImageUrl.push(image.location);
                        });
                        cat_sub_subsubData.otherImages = otherImageUrl;
                    }
                    
                    console.log('cat_sub_subsubData', cat_sub_subsubData);
                    // updateproduct_resp.status = 200;
                    // updateproduct_resp.data = cat_sub_subsubData;
                    res.status(200);
                    res.send(cat_sub_subsubData);
                }
            });
        }

    } catch (error) {
        logger.error('Error occurred while updating the product images', error);
        updateproduct_resp.status = 415;
        updateproduct_resp.data = result;
        res.status(200);
        res.send(updateproduct_resp);
    }

};

exports.updateproductReturnData = function (req, res, next){
    try {
        let updateproduct_resp = {};
        var productData = req.body;
        
        if (!productModel)
            return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
        else{
            console.log('productData image update', productData);
            
            let cat_sub_subsubData = {};
            cat_sub_subsubData.mainImage = req.files['mainImage'];
            cat_sub_subsubData.otherImages = req.files['otherImages'];

            updateproduct_resp.status = 200;
            updateproduct_resp.data = cat_sub_subsubData;
            res.send(updateproduct_resp);
        }

    } catch (error) {
        logger.error('Error occurred while updating the product images', error);
        updateproduct_resp.status = 415;
        updateproduct_resp.data = result;
        res.status(200);
        res.send(updateproduct_resp);
    }

};

exports.updateLogo = function(req, res, next){
    let updateLogo_resp = {};
    try {
        var profileData = req.body;
        console.log('updateLogo1', profileData.userId);
        if(!check.isUndefinedOrNullOrEmptyOrNoLen(req.files['logoImage'])){
            console.log('updateLogo2',  req.files['logoImage'][0].location);
            homeConfigTheme1Model.findByIdAndUpdate({_id:req.body["userId"]}, 
            {$set:{"storeGeneralInfo.imageLogo": req.files['logoImage'][0].location}}, function(err, result){
              if(err){
                updateLogo_resp.status = 500;
                updateLogo_resp.data = "Failed to update the Logo";
                res.status(500);
                res.send(updateLogo_resp);
              }
              else{
                if(check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                  let homeConfigTheme1ModelObj = new homeConfigTheme1Model();
                  homeConfigTheme1ModelObj._id = req.body["userId"];
                  homeConfigTheme1ModelObj.storeGeneralInfo.imageLogo = req.files['logoImage'][0].location;
                  homeConfigTheme1ModelObj.save(function(err, result){
                    if(err){
                        updateLogo_resp.status = 500;
                        updateLogo_resp.data = "Failed to update the Logo";
                        res.status(500);
                        res.send(updateLogo_resp);
                    }
                    else{
                        updateLogo_resp.status = 200;
                        updateLogo_resp.data = "Successfully updated";
                        res.status(200);
                        res.send(updateLogo_resp);
                    }
                  });
                }
                else{
                    updateLogo_resp.status = 200;
                    updateLogo_resp.data = "Successfully updated";
                    res.status(200);
                    res.send(updateLogo_resp);
                }
              }
            });
        }
        else{
            updateLogo_resp.status = 200;
            updateLogo_resp.data = "No Logo provided";
            res.status(200);
            res.send(updateLogo_resp);
        }

        
    } catch (error) {
        logger.error('Error occurred while updating store Logo', error);
        updateLogo_resp.status = 500;
        updateLogo_resp.data = "Failed to update the Logo";
        res.status(500);
        res.send(updateLogo_resp);
    }
}

function deleteimageFromS3(params) {
    return new Bluebird((resolve, reject) => {
        s3.deleteObjects(params, function (err, data) {
            if (err) return reject(err); // an error occurred
            else return resolve(data); // successful response
        });
    });
}

exports.deleteimage = function (req, res, next){
    // var bucket = s3_ver.bucket_name;
    var bucket_name = 'baimedia';
    var url_data = url.parse(req.url, true);
    var id = url_data.query._id;
    productModel.findOne({_id: id}, function (err, article) { 
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {

            var objects = [];
            console.log('article', article)
            const { uploadFiles, paragraph_img, sliderImg } = article.files[0];
            if (uploadFiles) {
                uploadFiles.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }
            if (paragraph_img) {
                paragraph_img.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }
            if (sliderImg) {
                sliderImg.forEach(file => {
                    objects.push({Key : file.originalname});
                })
            }

            var options = {
                Bucket: bucket_name,
                Delete: {
                    Objects: objects
                }
            };          

            deleteimageFromS3(options)
              .then(data => {
                console.log('deleteimageFromS3 then', data)
                productModel.deleteOne({_id:id},(err,object)=>{
                    if(err){
                        res.send({status:'failure',response:err});
                    }else{
                        //res.send({status:'Success',response:object});
                     res.status(200);
                            res.send();
                    }
                });
               
            }).catch (err => console.log(err)) 
        }
    });

    // try {
    //     s3.headObject(params).promise();
    //     console.log("File Found in S3");
    //     try {
    //         s3.deleteObject(params).promise();
    //         console.log("file deleted Successfully");
    //     }
    //     catch (err) {
    //         console.log("ERROR in file Deleting : " + JSON.stringify(err));
    //     }
    // } catch (err) {
    //         console.log("File not Found ERROR : " + err.code);
    // }
};

exports.updatePhoto = function (req, res, next){
    var productData = req.body;
    let set = {$set:{}};

    for(let key of Object.keys(req.files)){
        let overallData= set.$set;
        overallData[`files.0.${key}`] = req.files[key];
    }

    if (!productModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));

    productModel.findOneAndUpdate({ _id: productData._id }, set, {upsert:false,multi: true}).exec(function(err, th) {
        // console.log(insertedArticle);
        if (err) {
            return next(err);
        } else {
            res.status(200);
            res.send(th);
            next();
        }
    });
};
