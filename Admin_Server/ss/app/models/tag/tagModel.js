var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
//const shortid = require('shortid');

var TagSchema = mongoose.Schema({
    tagName:{type: String},
    authorName:{type:String}
});

var tagModel = mongoose.model('tagModel', TagSchema);
