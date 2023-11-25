var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var eventsSchema = mongoose.Schema({
     field_entity_profile_location: [],
     visualArt: [{ 
      	'Art Fairs': {type:Boolean},
        'Gallery Shows': {type:Boolean},
        'Museum Exhibitions': {type:Boolean},
        'Auctions': {type:Boolean},
        'Talks': {type:Boolean},
             _id:false  
    }],
    PerformingArts: [{ 
      	'Theater & Dance': {type:Boolean},
        Film : {type:Boolean},
        Music : {type:Boolean},
        Opera : {type:Boolean},
        _id:false  
    }],
    Lifestyle: [{ 
      	'Food & Wine': {type:Boolean},
        'Jewelry & Watches' : {type:Boolean},
        'Auto & Boats' : {type:Boolean},
        'Auctions' : {type:Boolean},
        'Fashion' : {type:Boolean},
        _id:false  
    }],
    ArcDesign: [{ 
      	All: {type:Boolean},
        _id:false  
    }],
    language: {type: String},
    title: {type: String},
    gallery: [{
    	field_events_artfair: {type: String},
    	field_events_both: {type: String},
    }],
    field_img_credit: {type: String},
    field_bool_single_chkbx_yes_no: {type: Boolean},
    field_event_image: {type: String},
    field_ongoing_event: {type: Boolean},

    field_ongoing_event: {type: Boolean},
    field_event_date: {type: String},
    field_event_date_to: {type: String},
    field_event_opening_time_start: {type: String},
    field_event_opening_time_end: {type: String},
    field_event_opening_date: {type: String},

    description_caption: {type: String},
    event_details: [{
    	field_website: {type: String},
    	field_location_website: {type: String},
    	field_price_range: {type: String},
    	field_price_range_to: {type: String},
    	field_editors_pick: {type: String},
    	field_featured: {type: String}
	}],
	referenced_artists: [{
    	field_artist_not_required: {type: Boolean},
    	field_artists: {type: String}
	}],
	referenced_article: [{
    	field_referenced_article: {type: String}
	}],
	referenced_parties: [{
    	field_photo_gallery: {type: String}
	}],
	referenced_videos: [{
    	field_fair_video: {type: String}
	}],
	referenced_fair: [{
    	referenced_fair_partners: {type: String},
    	field_fair_partner: {type: String},
	}],

    meta_keywords: {type: String},
    meta_description: {type: String},
    authored_by: {type: String},
    authored_on: {type: String},
    published: {type: String},
    files:[]

     //authorDescription: {type:String}
    
});

var eventsModel = mongoose.model('eventsModel', eventsSchema);
