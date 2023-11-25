var restify = require('restify');
var trendsModel = require('mongoose').model('trendsModel');
const mongoose = require('mongoose');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');

exports.trendUsers = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
   jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var trendData = req.body;
    var formattedtrendData = formattrendData();
    console.log('Creating event Data with', trendData, '---------------------\n');

    trendsModel.create(formattedtrendData, function (err, insertedEvent) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedEvent);
            res.send(insertedEvent);
        }
    });
    //Format Article data
    function formattrendData() {
        return {
        subCategory: trendData.subCategory,
        description:trendData.description,
        author_article: trendData.author_article,
        files:req.files,
        };
    };
}
exports.updatearticle = function (req, res, next) {
   jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var trendData = req.body;
    console.log(req.files);
    var id = trendData._id;
    // var sliderImg = trendData.sliderImg;
    // var paragraph_img = trendData.paragraph_img;
    console.log('Creating Article Data with', trendData, '---------------------\n');
    if (!trendsModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    // Verify Article Data----To be Done
    //articleUtil.verifytrendData(req, res, next, insertClasstrendData);
    // var formattedtrendData = formattrendData();
    // console.log(formattrendData);
    trendsModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(trendData._id) }, { $push: { files: req.files } }).exec(function (err, th) {
        // console.log(insertedEvent);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send('Events Created');
            next();
        }
    });
}
exports.getTrendByUserId = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var userId = req.params.userId;
    console.log(userId);
    trendsModel.find({createrId:userId},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.getTrendByTrendId = (req,res,next)=>{
    let trendId = req.params.trendId;
    trendsModel.find({_id:trendId},(err,data)=>{
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.deleteTrend = (req,res,next)=>{
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var TrendId = req.params.TrendId;
    console.log(TrendId);
    trendsModel.remove({_id:TrendId},(err,object)=>{
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:object});
        }
    });
};

exports.getTrends =  (req, res, next)=>{
 //  jwt.validateToken;
   // featureChecker.hasAccessToFeatureNew;

    var cursor = trendsModel;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find(function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(objs);
            }
        });
    }    
}