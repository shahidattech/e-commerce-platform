var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var categorySubSchema = mongoose.Schema({
    _id: {type: String},
    sub_categories:[{
        subCategoryId: { type: String},
        subCategoryName : { type: String},
        categoryId: { type: String},
        products: [{
            productId: { type: String },
            added_date: { type: Date, default: Date.now },
            short_title: { type: String, required: true },
            // price: { type: Number },
            // weight: {type: String},
            attributes: [],
            gst: {type: String},
            color: {type: String},
            isReviewed: { type: Boolean, default: false},
            codOption: { type: String },
            mainImageUrl: {type: String} 
        }]
    }]
});
categorySubSchema.plugin(mongoosePaginate);
var CategorySubModel = mongoose.model('categorySub', categorySubSchema);

