var restify = require('restify');
var travelcityModel = require('mongoose').model('travelcityModel');
const mongoose = require('mongoose');
//var jwt = require('../../service/auth/jwt')
//var featureChecker = require('../../service/auth/featureChecker');

exports.travelcityUsers = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
   // jwt.validateToken,
    //featureChecker.hasAccessToFeatureNew,
    //body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var travelcityData = req.body;
    var formattedtravelcityData = formattravelcityData();
    console.log('Creating event Data with', travelcityData, '---------------------\n');

    travelcityModel.create(formattedtravelcityData, function (err, insertedEvent) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            console.log(insertedEvent);
            res.send(insertedEvent);
        }
    });
    //Format Article data
    function formattravelcityData() {
        return {
        field_short_title: travelcityData.field_short_title,
        longitude:travelcityData.longitude,
        lattitude: travelcityData.lattitude,
        field_tr_city_tagline: travelcityData.field_tr_city_tagline,
        field_tr_city_best_visit_time: travelcityData.field_tr_city_best_visit_time,
        field_tr_city_what_to_pack: travelcityData.field_tr_city_what_to_pack,
        genral_tips: travelcityData.genral_tips,
        language: travelcityData.language,
        teaser: travelcityData.teaser,
        field_tr_location_info_location: travelcityData.field_tr_location_info_location,
        field_tr_city_reference: travelcityData.field_tr_city_reference,
        tags: travelcityData.tags,
        top_restaurants: travelcityData.top_restaurants,
        field_restaurant: travelcityData.field_restaurant,
        top_shopings: travelcityData.top_shopings,
        top_shoping: travelcityData.top_shoping,
        authored_by: travelcityData.authored_by,
        authored_on: travelcityData.authored_on,
        published: travelcityData.published,
        files:req.files   
        };
    };
}
exports.updatearticle = function (req, res, next) {
  //  jwt.validateToken;
    //featureChecker.hasAccessToFeatureNew;
    var travelcityData = req.body;
    console.log(req.files);
    var id = travelcityData._id;
    // var sliderImg = travelcityData.sliderImg;
    // var paragraph_img = travelcityData.paragraph_img;
    console.log('Creating Article Data with', travelcityData, '---------------------\n');
    if (!travelcityModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    // Verify Article Data----To be Done
    //articleUtil.verifytravelcityData(req, res, next, insertClasstravelcityData);
    // var formattedtravelcityData = formattravelcityData();
    // console.log(formattravelcityData);
    travelcityModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(travelcityData._id) }, { $push: { files: req.files } }).exec(function (err, th) {
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
