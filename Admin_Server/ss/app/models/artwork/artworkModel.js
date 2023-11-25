var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
var artistsSchema = require(path.join(__dirname, 'artists', 'artists'));
var venu = require('../events/venues/venues');
var ArtworkSchema = mongoose.Schema({
     artworkId: {type: String,default: shortid.generate},
     entityLocation: venu,
     title:{type:String},
     artworkType: {type:String},
     field_artists: artistsSchema,
     language:{type:String},
     img_height:{type: String},
     img_width:{type:String},
     files:[],
     img_depth:{type:String},
     img_units:{type:String},
     img_measurmentDescription:{type:String},
     img_mediumCategory:{type:String},
     material:{type:String},
     edition:{type:String},
     circa:{type:String},
     img_start_date:{type:String},
     date_dateQualifier:{type:String},
     artWorkSpecialties:[{type:String}],
     date_subject:{type:String},
     date_status:{type:String},
     date_priceFrom:{type:String},
     date_priceTo:{type:String},
     currency:{type:String},
     extraDescription:{type:String},
     seo_keywords: {type:String},
     authored_by:{type:String},
     authored_on:{type:String},
     published:{type:Boolean},
     seo_description:{type:String},
     artwork_order:{type:String},
     createdBy:{type:String}
    });

var artworkModel = mongoose.model('artworkModel', ArtworkSchema);
