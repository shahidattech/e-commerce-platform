var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var usersSchema = mongoose.Schema({
 
    files:[]

     //authorDescription: {type:String}
    
});

var usersModel = mongoose.model('usersModel', usersSchema);
