var restify = require('restify');
var travelprofileModel = require('mongoose').model('travelprofileModel');
const mongoose = require('mongoose');
//var jwt = require('../../service/auth/jwt')
//var featureChecker = require('../../service/auth/featureChecker');

exports.travelprofileUsers = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
   // jwt.validateToken,
    //featureChecker.hasAccessToFeatureNew,
    //body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var travelprofileData = req.body;
    var formattedtravelprofileData = formattravelprofileData();
    console.log('Creating event Data with', travelprofileData, '---------------------\n');

    travelprofileModel.create(formattedtravelprofileData, function (err, insertedEvent) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedEvent);
            res.send(insertedEvent);
        }
    });
    //Format Article data
    function formattravelprofileData() {
        return {
        title: travelprofileData.title,
        field_tr_website_url_title:travelprofileData.field_tr_website_url_title,
        field_tr_website_url: travelprofileData.field_tr_website_url,
        field_tr_location_info_location: travelprofileData.field_tr_location_info_location,
        enter_Address_location: travelprofileData.enter_Address_location,
        field_tr_location_info_street: travelprofileData.field_tr_location_info_street,
        field_tr_location_info_additional: travelprofileData.field_tr_location_info_additional,
        field_tr_location_info_country: travelprofileData.field_tr_location_info_country,
        field_tr_location_info_state: travelprofileData.field_tr_location_info_state,
        field_tr_location_info_city: travelprofileData.field_tr_location_info_city,
        field_tr_location_info_Latitude: travelprofileData.field_tr_location_info_Latitude,
        field_tr_location_info_Longitude: travelprofileData.field_tr_location_info_Longitude,
        field_tr_location_info_Neighborhood: travelprofileData.field_tr_location_info_Neighborhood,
        field_tr_profile: travelprofileData.field_tr_profile,
        must_know: travelprofileData.must_know,
        field_artists_rates: travelprofileData.field_artists_rates,
        field_artists_rating: travelprofileData.field_artists_rating,
        field_tr_summary: travelprofileData.field_tr_summary,
        field_tr_reference_city: travelprofileData.field_tr_reference_city,
        field_tr_entity_type: travelprofileData.field_tr_entity_type,
        brightcove_videos: travelprofileData.brightcove_videos,
        enitiy_details: travelprofileData.event_details,
        entity_carousel_images: travelprofileData.entity_carousel_images,
        field_event_image:travelprofileData.field_event_image,
        locationEmail_section: travelprofileData.locationEmail_section,
        locationEmail: travelprofileData.locationEmail,
        referenced_article: travelprofileData.referenced_article,
        field_referenced_article: travelprofileData.field_referenced_article,
        business_hours: travelprofileData.business_hours,
        authored_by: travelprofileData.authored_by,
        authored_on: travelprofileData.authored_on,
        published: travelprofileData.published,
        files:req.files   
        };
    };
}
exports.updatearticle = function (req, res, next) {
  //  jwt.validateToken;
    //featureChecker.hasAccessToFeatureNew;
    var travelprofileData = req.body;
    console.log(req.files);
    var id = travelprofileData._id;
    // var sliderImg = travelprofileData.sliderImg;
    // var paragraph_img = travelprofileData.paragraph_img;
    console.log('Creating Article Data with', travelprofileData, '---------------------\n');
    if (!travelprofileModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    // Verify Article Data----To be Done
    //articleUtil.verifytravelprofileData(req, res, next, insertClasstravelprofileData);
    // var formattedtravelprofileData = formattravelprofileData();
    // console.log(formattravelprofileData);
    travelprofileModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(travelprofileData._id) }, { $push: { files: req.files } }).exec(function (err, th) {
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
