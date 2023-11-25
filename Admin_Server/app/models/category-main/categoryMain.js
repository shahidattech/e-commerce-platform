var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');


var categoryMainSchema = mongoose.Schema({
    _id: {type: String},
    categories:[{
        categoryId: { type: String},
        categoryName : { type: String},
        products: [{
            productId: { type: String },
            added_date: { type: Date, default: Date.now },
            short_title: { type: String, required: true },
            attributes: [],
            gst: {type: String},
            color: {type: String},
            isReviewed: { type: Boolean, default: false},
            codOption: { type: String },
            mainImageUrl: {type: String},
            otherImages: []
        }]
    }]
});
categoryMainSchema.plugin(mongoosePaginate);
var CategoryMainModel = mongoose.model('categoryMain', categoryMainSchema);

