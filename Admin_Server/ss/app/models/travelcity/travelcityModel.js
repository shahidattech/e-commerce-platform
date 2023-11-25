var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var travelcitySchema = mongoose.Schema({
    field_short_title: {type: String},
    longitude: {type: String},
    lattitude: {type: String},
    field_tr_city_tagline: {type: String},
    top_restaurants:[{
      field_restaurant: {type: String}
    }],
    field_tr_city_best_visit_time: {type:String},
    field_tr_city_what_to_pack: {type:String},
    genral_tips: {type:String},
    language: {type:String},
    teaser: {type:String},
    field_tr_location_info_location: {type:String},
    field_tr_city_reference: {type:String},
    tags: {type:String},
    top_shopings: [{
        top_shoping: {type: String},
         _id:false  
    }],
    authored_by: {type: String},
    authored_on: {type: String},
    published: {type: String},
    files:[]

     //authorDescription: {type:String}
    
});

var travelcityModel = mongoose.model('travelcityModel', travelcitySchema);
