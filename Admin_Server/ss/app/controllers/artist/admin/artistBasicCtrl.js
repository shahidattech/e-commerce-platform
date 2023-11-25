var restify = require('restify');
var artistModel = require('mongoose').model('artistModel');
const mongoose = require('mongoose');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');
exports.createArtist = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var artistData = req.body;
    var formattedArtclData = formatArticleData(artistData);
    console.log('Creating Article Data with', artistData, '---------------------\n');

    artistModel.create(formattedArtclData, function (err, insertedArticle) {
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

function formatArticleData(artistData) {
    return {
        artistName: artistData.artistName,
        language: artistData.language,
        articleDescription: artistData.articleDescription,
        fname:artistData.fname,
        lname:artistData.lname,
        show_date:artistData.show_date,
        knownas:artistData.knownas,
        nationality:artistData.nationality,
        photo_credit:artistData.photo_credit,
        artist_statement:artistData.artist_statement,
        field_country:artistData.field_country,
        field_specialties:artistData.field_specialties,
        fomat_date:artistData.fomat_date,
        tofomat_date:artistData.tofomat_date,
        field_birth_year_qualifier:artistData.field_birth_year_qualifier,
        field_death_year_quallifier:artistData.field_death_year_quallifier,
        place_of_birth:artistData.place_of_birth,
        place_of_death:artistData.place_of_death,
        date_description:artistData.date_description,
        articleDescription: artistData.articleDescription,
        seo_keywords: artistData.seo_keywords,
        authored_by:artistData.authored_by,
        authored_on:artistData.authored_on,
        published:artistData.published,
        seo_description:artistData.seo_description,
        seo_title:artistData.seo_title
    };
}

exports.updateartists = function (req, res, next) {
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var cursor = artistModel;
    var artistData = formatArticleData(req.body);
    console.log('id===>',req.body._id);

    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }else{
        artistModel.findOneAndUpdate({ _id: req.body._id},artistData,function (err, th) {
            // console.log(insertedArticle);
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(th);
            }
        });
    }
}

exports.getArtists = function (req, res, next){
    
    var cursor = artistModel;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({},function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(objs);
            }
        });
    }    
}

exports.getArtistByArtistId = (req,res,next)=>{
    var cursor = artistModel;
    let artistId = req.params.artistId;
    console.log(artistId)
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({_id:artistId},(err,data)=>{
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
    }
}