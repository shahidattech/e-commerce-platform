var restify = require('restify');
var EntityLocationProfileModel = require('mongoose').model('EntityLocationProfileModel');
const mongoose = require('mongoose');
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');

exports.createEntityLocationProfile= function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    jwt.validateToken,
    featureChecker.hasAccessToFeatureNew,
    body_json = JSON.stringify(req.body);
    console.log(req.body)

    // console.log(body_json);
    var EntityLocationData = req.body;
    var formatedEntityLocationData = formatEntityLocationData(EntityLocationData);
    console.log('Creating Entity Location Profile Data with', EntityLocationData, '---------------------\n');

    EntityLocationProfileModel.create(formatedEntityLocationData, function (err, insertedEntity) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedEntity);
            res.send(insertedEntity);
        }
    });
    //Format Article data
    ;
}


function formatEntityLocationData(EntityLocationData) {
    return {
        entityType: EntityLocationData.entityType,
        language:EntityLocationData.language,
        entityName: EntityLocationData.entityName,
        websiteTitle:EntityLocationData.websiteTitle,
        url:EntityLocationData.url,
        facebookWebsite:EntityLocationData.facebookWebsite,
        twitterWebsite:EntityLocationData.twitterWebsite,
        googlePlusWebsite:EntityLocationData.googlePlusWebsite,
        briefInfo:EntityLocationData.briefInfo,
        specialties:[EntityLocationData.specialties],
        locationName:EntityLocationData.locationName,
        file:[],
        street:EntityLocationData.street,
        additional:EntityLocationData.additional,
        country:EntityLocationData.country,
        stateProvince:EntityLocationData.stateProvince,
        city:EntityLocationData.city,
        postalCode:EntityLocationData.postalCode,
        latitude:EntityLocationData.latitude,
        longitude:EntityLocationData.longitude,
        neighborhood:EntityLocationData.neighborhood,
        locationPhone:EntityLocationData.locationPhone,
        locationFax: EntityLocationData.locationFax,
        locationEmail: EntityLocationData.locationEmail,
        openingHoursAlternative:EntityLocationData.openingHoursAlternative,
        region:EntityLocationData.region,
        contract_Notes:EntityLocationData.contract_Notes,
        contract_Description:EntityLocationData.contract_Description,
        contract_Representative:EntityLocationData.contract_Representative,
        CEO_Name:EntityLocationData.CEO_Name,
        CEO_ChiefMarketingOfficer:EntityLocationData.CEO_ChiefMarketingOfficer,
        CEO_HeadquartersCityOrCountry:EntityLocationData.CEO_HeadquartersCityOrCountry,
        CEO_EventLocation:EntityLocationData.CEO_EventLocation,
        seo_description:EntityLocationData.seo_description,
        seo_Keywords:EntityLocationData.seo_Keywords,
        tags:EntityLocationData.tags,
        url_alias:EntityLocationData.url_alias,
        revisionLogMessage:EntityLocationData.revisionLogMessage,
        authored_by:EntityLocationData.authored_by,
        authored_on:EntityLocationData.authored_on,
        publishOption:[EntityLocationData.publishOption],
        createdBy:EntityLocationData.userId
    };
}


exports.updateVenue = function(req,res,next){
    var cursor = EntityLocationProfileModel;
    var EventData = formatEntityLocationData(req.body);
    console.log('Event id===>',req.body._id);

    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }else{
        cursor.findOneAndUpdate({ _id: req.body._id},EventData,function (err, th) {
            // console.log(insertedArticle);
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send('EventData Updated');
            }
        });
    }
}

exports.getvenue = function (req, res, next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    var cursor = EntityLocationProfileModel;
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

exports.getVenueByUserId = (req,res,next)=>{
    var cursor = EntityLocationProfileModel;
    var userId = req.params.userId;
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

exports.getentityLocationByEntityId = (req,res,next)=>{
    var cursor = EntityLocationProfileModel;
    let entityId = req.params.entityId;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({_id:entityId},(err,data)=>{
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
    }
};