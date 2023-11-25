var mongoose = require('mongoose');

var mainImageSchema = mongoose.Schema({
    mainImageUrl: { type: String },
    imageText: { type: String },
}, { _id : false });

var featureImageSchema = mongoose.Schema({
    featureImageUrl: { type: String },
    imageText: { type: String },
}, { _id : false });

var thumbnailImageSchema = mongoose.Schema({
    thumbnailImageUrl: { type: String },
    imageText: { type: String },
}, { _id : false });

var wideImageSchema = mongoose.Schema({
    wideImageUrl: { type: String },
    imageText: { type: String },
}, { _id : false });

var articleImageSchema = mongoose.Schema({
    articleId: { type: String, required: true },
    mainImage : { mainImageSchema },
    featureImage : { featureImageSchema },
    thumbnailImage : { thumbnailImageSchema }

});

var articleImageSchema = mongoose.model('articlemodels', articleImageSchema);