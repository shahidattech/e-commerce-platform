var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var travelprofileSchema = mongoose.Schema({
    title: {type: String},
    field_tr_website_url_title: {type: String},
    field_tr_website_url: {type: String},
    field_tr_location_info_location: {type: String},
    enter_Address_location:[{
      field_tr_location_info_street: {type: String},
      field_tr_location_info_additional: {type: String},
      field_tr_location_info_country: {type: String},
      field_tr_location_info_state: {type: String},
      field_tr_location_info_city: {type: String},
      field_tr_location_info_Latitude: {type:String},
      field_tr_location_info_Longitude: {type:String},
      field_tr_location_info_Neighborhood: {type:String},
    }],
    field_tr_profile: {type:String},
    must_know: {type:String},
    field_artists_rates: {type:String},
    field_artists_rating: {type:String},
    field_tr_summary: {type:String},
    field_tr_reference_city: {type:String},
    field_tr_entity_type: {type:String},
    brightcove_videos: {type:String},
    entity_carousel_images: {type:String},
    locationEmail_section: [{
        locationEmail: {type: String},
         _id:false  
    }],
    referenced_article: [{
        field_referenced_article: {type: String},
         _id:false  
    }],
    business_hours: {type: String},
    authored_by: {type: String},
    authored_on: {type: String},
    published: {type: String},
    files:[]

     //authorDescription: {type:String}
    
});

var travelprofileModel = mongoose.model('travelprofileModel', travelprofileSchema);
