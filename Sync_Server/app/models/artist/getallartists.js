var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');

var getallartistsSchema = mongoose.Schema({
	
	top_artists:[{
	 artistName: {type: String},
     files:[],
     articleDescription: {type:String},
     views:{type:Number,default:0},
	}],
	most_popular_top_artists:[{
	 artistName: {type: String},
     files:[],
     articleDescription: {type:String},
     views:{type:Number,default:0},
	}]
     
     
     
    });

var getallArtistsModel = mongoose.model('getallArtists', getallartistsSchema);
