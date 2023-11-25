var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var authorSchema = mongoose.Schema({
     author: {type: String},
     authorName:{type:String},
     authorTitle: {type:String},
     authorDescription: {type:String}
    
});

var authorModel = mongoose.model('authorModel', authorSchema);
