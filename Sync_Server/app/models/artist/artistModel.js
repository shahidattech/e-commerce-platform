var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');

var ArtistSchema = mongoose.Schema({
     artistName: {type: String},
     language:{type:String},
     articleDescription: {type:String},
     fname:{type:String},
     added_date:{type: Date,default: Date.now},
     lname:{type:String},
     views:{type:Number,default:0},
     show_date:{type:String},
     knownas:{type:String},
     files:[],
     nationality:{type:String},
     photo_credit:{type:String},
     artist_statement:{type:String},
     field_country:{type:String},
     field_specialties:[{type:String}],
     fomat_date:{type:String},
     tofomat_date:{type:String},
     field_birth_year_qualifier:{type:String},
     field_death_year_quallifier:{type:String},
     place_of_birth:{type:String},
     place_of_death:{type:String},
     date_description:{type:String},
     articleDescription: {type:String},
     seo_keywords: {type:String},
     authored_by:{type:String},
     authored_on:{type:String},
     published:{type:String},
     seo_description:{type:String},
     seo_title:{type:String},
     
    });

var artistModel = mongoose.model('artistModel', ArtistSchema);
