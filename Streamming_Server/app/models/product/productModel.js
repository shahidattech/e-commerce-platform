var mongoose = require('mongoose');
// var ObjectId = require('mongoose').Schema.Types.ObjectId;
// var path = require('path');
const shortid = require('shortid');
// const mongoosePaginate = require('mongoose-paginate');
// const { text } = require('body-parser');

var productSchema = mongoose.Schema({
    _id: { type: String },
    products:[
        {
            // producID: { type: Number, default: 0 },
            added_date: { type: Date, default: Date.now },
            createrId: { type: String },
            description: { type: String },
            // length: { type: String },
            main_category: { type: String },
            mainImage: [],
            otherImages: [],
            Published: { type: String },
            productId: { type: String, default: shortid.generate },
            // price: { type: Number },
            codOption: { type: String },
            gst: { type: Number },
            return_policy: { type: String },
            saveDrafts: { type: String },
            size: { type: String },
            // weight: {type: String},
            color: {type: String},
            stock: {type: String},
            seo_keywords: { type: String },
            short_title: { type: String, required: true },
            sub_category: { type: String },
            sub_sub_category: { type: String },
            tags: [],
            title: { type: String, required: true },
            views: { type: Number, default: 0 },
            related_products: [],
            relatedSlideShows: [],
            isReviewed: { type: Boolean, default: false},
            ratings_reviews:[{
                customerId: { type: String },
                customerName: { type: String },
                customerProfilePic: { type: String },
                rating : {type: Number },
                review : {type: String },
                added_date: { type: Date, default: Date.now },
                published: { type: Boolean, default: false}
            }],
            attributes: []
        }
    ]
});
// productSchema.plugin(mongoosePaginate);
var productImageModel = mongoose.model('Product', productSchema);




