var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var tagSchema = mongoose.Schema({
    authorName: { type: String},
    tagName: {type: String},
    userId: {type: String}
});
// tagSchema.plugin(mongoosePaginate);
var TagModel = mongoose.model('tagModel', tagSchema);




