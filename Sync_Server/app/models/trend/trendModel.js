var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
var userSchema = require(path.join(__dirname, 'users', 'users'));
var trendprofileSchema = mongoose.Schema({
    author_article: userSchema,
    subCategory: {type: String},
    trendId: {type: String,default: shortid.generate},
    description:{type:String},
    files:[]

     //authorDescription: {type:String}
    
});

var trendsModel = mongoose.model('trendsModel', trendprofileSchema);
