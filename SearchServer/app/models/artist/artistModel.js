var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');

var ArtistSchema = mongoose.Schema({
     artistName: {type: String},
     language:{type:String},
     artist: {type:String},
     articleDescription: {type:String},

     location: {type:String},
     street_location: {type:String},
     Additional: {type:String},
     Neighborhood: {type:String},
     Country: {type:String}
});

var artistModel = mongoose.model('artistModel', ArtistSchema);
