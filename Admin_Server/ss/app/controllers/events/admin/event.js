var restify = require('restify');
var eventsModel = require('mongoose').model('eventsModel');

const mongoose = require('mongoose');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');

exports.eventUsers = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    // console.log(body_json);
    var eventData = req.body;
    var formattedeventData = formateventData(eventData);
    console.log('Creating event Data with', eventData, '---------------------\n');

    eventsModel.create(formattedeventData, function (err, insertedEvent) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedEvent);
            res.send(insertedEvent);
        }
    });
    //Format Article data
    
}

function formateventData(eventData) {
    return {
    field_entity_profile_location: eventData.field_entity_profile_location,
    visual_arts:eventData.visual_arts,
    performing_arts: eventData.performing_arts,
    Life_style: eventData.Life_style,
    Arc_design: eventData.Arc_design,
    image_information: eventData.image_information,
    image_caption:eventData.image_caption,
    image_credit:eventData.image_credit,
    image_title:eventData.image_title,
    gallery: eventData.gallery,
    urlalias:eventData.urlalias,
    currencyCost:eventData.currencyCost,
    referenced_artists: eventData.referenced_artists,
    event_carousel: eventData.event_carousel,
    field_events_artfair: eventData.field_events_artfair,
    field_events_both: eventData.field_events_both,
    language: eventData.language,
    title: eventData.title,
    new_revision:eventData.new_revision,
    revision_message:eventData.revision_message,
    field_img_credit: eventData.field_img_credit,
    field_bool_single_chkbx_yes_no: eventData.field_bool_single_chkbx_yes_no,
    field_event_image: eventData.field_event_image,
    field_ongoing_event: eventData.field_ongoing_event,
    field_event_date: eventData.field_event_date,
    field_event_date_to: eventData.field_event_date_to,
    field_event_opening_time_start: eventData.field_event_opening_time_start,
    field_event_opening_time_end: eventData.field_event_opening_time_end,
    field_event_opening_date: eventData.field_event_opening_date,
    description_caption: eventData.description_caption,
    event_details: eventData.event_details,
    field_website: eventData.field_website,
    field_location_website: eventData.field_location_website,
    field_price_range: eventData.field_price_range,
    field_price_range_to: eventData.field_price_range_to,
    field_editors_pick: eventData.field_editors_pick,
    field_featured: eventData.field_featured,
    referenced_artists: eventData.referenced_artists,
    field_artist_not_required: eventData.field_artist_not_required,
    field_artists: eventData.field_artists,
    referenced_article: eventData.referenced_article,
    field_referenced_article: eventData.field_referenced_article,
    referenced_parties: eventData.referenced_parties,
    field_photo_gallery: eventData.field_photo_gallery,
    referenced_videos: eventData.referenced_videos,
    field_fair_video: eventData.field_fair_video,
    referenced_fair: eventData.referenced_fair,
    referenced_fair_partners: eventData.referenced_fair_partners,
    field_fair_partner: eventData.field_fair_partner,
    press_relese: eventData.press_relese,
    meta_keywords: eventData.meta_keywords,
    meta_description: eventData.meta_description,
    authored_by: eventData.authored_by,
    authored_on: eventData.authored_on,
    published: eventData.published,
    createdBy:eventData.userId
    };
};
exports.updateEvent = function (req, res, next) {
   jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var cursor = eventsModel;
    var eventData = formateventData(req.body);
    console.log(req.body._id)
    
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }else{
        cursor.findOneAndUpdate({ _id:req.body._id}, eventData ,function (err, th) {
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
        
    
}


exports.getPhotos = (req,res, next)=>{
  
    var filename = req.params._id;

    var cursor = eventsModel;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.findOne({'_id': filename }, (err, result) => {
           if (err) {
                return next(new restify.errors.InternalServerError(err));
            }else{
                console.log(filename);
               //res.contentType('image/jpeg');
               res.send(result.image.buffer);
              }
         })
       
    }    
}


exports.getEvents =  (req, res, next)=>{
 jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    var cursor = eventsModel;
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

exports.getEventByUserId = (req,res,next)=>{
    var cursor = eventsModel;
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

exports.getEventByEventId = (req,res,next)=>{
    var cursor = eventsModel;
    let eventId = req.params.eventId;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({_id:eventId},(err,data)=>{
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
    }
};
exports.deleteEvents = (req,res,next)=>{
    var cursor = eventsModel;
    let eventId = req.params.eventId;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.remove({_id:eventId},(err,data)=>{
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
    }
};
exports.deleteEvents = (req,res,next)=>{
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var cursor = eventsModel;
    var eventId = req.params.eventId;
    console.log(eventId);
    cursor.remove({_id:eventId},(err,object)=>{
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:object});
        }
    });
};