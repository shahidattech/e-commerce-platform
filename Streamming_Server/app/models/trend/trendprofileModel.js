var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');

var trendprofileSchema = mongoose.Schema({
     files:[]

     //authorDescription: {type:String}
    
});

var trendsModel = mongoose.model('trendsModel', trendprofileSchema);
