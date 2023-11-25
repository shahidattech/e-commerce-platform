var restify = require('restify');
var articleModel = require('mongoose').model('articleModel');
var mongoose = require('mongoose');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');
var db_data = require('../../../data/db_data');
var _ = require('underscore');
var articleHome = require('mongoose').model('homepageconfig');
var url = require('url');


country_abb_dict = {
    "All" : "ALL",
    "International" : "INTR",
    "Australia" : "AU",
    "Canada" : "CA",
    "China" : "CHINA",
    "France" : "FR",
    "Germany" : "DE",
    "HongKong" : "HK",
    "India" : "IND",
    "Italy" : "ITL",
    "Japan" : "JP",
    "Korea" : "KR",
    "MiddleEast" : "ME",
    "Spain" : "ES",
    "Uk" : "UK"
};
exports.createArticle = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var articleData = req.body;
    var formattedArtclData = formatArticleData(articleData,req);
    console.log('Creating Article Data with', articleData, '---------------------\n');

    articleModel.create(formattedArtclData, function (err, insertedArticle) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedArticle);
            res.send(insertedArticle);
        }
    });
    //Format Article data
    
};

function formatArticleData(articleData,req) {
    return {
        title: articleData.title,
        createrId: articleData.userId,
        short_title: articleData.short_title,
        summary: articleData.summary,
        tags: articleData.tags,
        //categoryRadio: articleData.categoryRadio,
        AddImgParagraph: articleData.AddImgParagraph,
        image_caption: articleData.image_caption,
        Published: articleData.Published,
        saveDrafts:articleData.saveDrafts,
        visual_arts_type: articleData.visual_arts_type,
        architecture_design_type: articleData.architecture_design_type,
        performance_design_type: articleData.performance_design_type,
        lifestyle_design_type: articleData.lifestyle_design_type,
        fashion_design_type: articleData.fashion_design_type,
        travel_design_type: articleData.travel_design_type,
        image_credit: articleData.image_credit,
        imageTitle: articleData.imageTitle,
        alt_text: articleData.alt_text,
        para_head: articleData.para_head,
        visual_arts: articleData.visual_arts,
        image_caption_para: articleData.image_caption_para,
        Para_img_cap_credit: articleData.Para_img_cap_credit,
        image_title_paragraph: articleData.image_title_paragraph,
        image_alt_paragraph: articleData.image_alt_paragraph,
        sub_channel: articleData.sub_channel,
        category_type:articleData.category_type,
        sub_subs: articleData.sub_subs,
        genu_res: articleData.genu_res,
        ArchitectureChannels: articleData.ArchitectureChannels,
        ArchitectureSubs: articleData.ArchitectureSubs,
        PerformanceChannels: articleData.PerformanceChannels,
        PerformanceSubs: articleData.PerformanceSubs,
        LifesytlesChannels: articleData.LifesytlesChannels,
        LifesytlesSubs: articleData.LifesytlesSubs,
        FashionChannels: articleData.FashionChannels,
        FashionSubs : articleData.FashionSubs,
        TravelChannels: articleData.TravelChannels,
        TravelSubs: articleData.TravelSubs,
        files: req.files,
        sliderUpload: articleData.sliderUpload,
        enable_inq: articleData.enable_inq,
        imageCaption: articleData.imageCaption,
        ImageCredit: articleData.ImageCredit,
        ImageTitle: articleData.ImageTitle,
        AltText: articleData.AltText,
        author_article: articleData.author_article,
        artistData: articleData.artistData,
        referencevenue: articleData.referencevenue,
        referenceEvents: articleData.referenceEvents,
        auctionResults: articleData.auctionResults,
        recommendArticles: articleData.recommendArticles,
        globalarticleRegion: articleData.globalarticleRegion,
        GlobalRegion: articleData.GlobalRegion,
        All_country: articleData.All_country,
        ReferenceArtist: articleData.ReferenceArtist,
        ReferenceVenue: articleData.ReferenceVenue,
    };
}


exports.updatearticle = function(req,res,next){
    var cursor = articleModel;
    var articleData = formatArticleData(req.body,req);
    console.log('id===>',req.body._id);

    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }else{
        articleModel.findOneAndUpdate({ _id: req.body._id},articleData,function (err, th) {
            // console.log(insertedArticle);
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send('Article Updated');
            }
        });
    }
}

exports.getArticleByUserId = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var userId = req.params.userId;
    console.log(userId);
    articleModel.find({},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};

exports.deleteArticle = (req,res,next)=>{
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var articleId = req.params.articleId;
    console.log(articleId);
    articleModel.remove({_id:articleId},(err,object)=>{
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:object});
        }
    });
};

exports.getArticleByArticleId = (req,res,next)=>{
    let articleId = req.params.articleId;
    articleModel.find({"_id":articleId},(err,data)=>{
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};

exports.getArticle = (req,res,next)=>{
    let articleId = req.params.articleId;
    articleModel.find(function(err,data){
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(data);
        }
    });
};

exports.getArticleByCountry = function (req, res, next){
    var url_data = url.parse(req.url, true);
    if (url_data.query.country_name in country_abb_dict){
        console.log(url_data.query.country_name);
        var cursor = articleHome;
        db_data.executeQuery(cursor, {"country_abb": country_abb_dict[url_data.query.country_name]}, res, next, function(result){
            res.send(result);
        });
    }
    else{
        res.send({"result": "Name not Exist"});
    }
    
};

exports.updatePosition = (req,res,next)=>{
    let id = req.body.id
    let pos = req.body.pos
    articleHome.findOneAndUpdate({'_id': id}, {"$set": { "pos": pos, }},
    function(err,doc) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send('Article Home Updated');
            next();
        }
    });
}
