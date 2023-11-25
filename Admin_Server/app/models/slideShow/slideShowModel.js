var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var slideShowSchema = mongoose.Schema({
    _id: { type: String },
    slideShows: [{
        title: { type: String, required: true },
        shortTitle: { type: String, required: true },
        description: { type: String },
        userId:{ type: String },
        slides:[{
            location: { type: String },
            image_caption: { type: String },
            image_credit: { type: String },
            imageTitle: { type: String },
        }],
        added_date: { type: Date, default: Date.now },
    }],
    viewsCount: { type: Number, default: 0 },
    Published: { type: Boolean }
});

slideShowSchema.plugin(mongoosePaginate);
var slideShowModel = mongoose.model('slideShowModel', slideShowSchema);

