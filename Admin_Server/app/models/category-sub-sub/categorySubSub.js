var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var categorySubSubSchema = mongoose.Schema({
    _id: {type: String},
    sub_sub_categories:[{
        subSubCategoryId: { type: String},
        subSubCategoryName : { type: String},
        subCategoryId: { type: String},
        categoryId: { type: String},
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
categorySubSubSchema.plugin(mongoosePaginate);
var CategorySubSubModel = mongoose.model('categorySubSub', categorySubSubSchema);

