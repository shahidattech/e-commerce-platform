var mongoose = require('mongoose');
var path = require('path');
var userSchema = require(path.join(__dirname, 'users', 'users'));
var sitepageconfigSchema = mongoose.Schema({
    country_abb: {type: String},
    articleId: {type: String},
    image: [],
    sub_cat_label: {type: String},
    short_title: {type: String},
    summary: {type: String},
    date_stamp: {type: String},
    author: userSchema,
    pos: {type: String},
    trending: [{
        short_title: {type: String},
        image: [],
        sub_subs: {type: String},
        date_stamp: {type: String},
        author: userSchema
    }],
    topGlobalStories: [{
        short_title: {type: String},
        image: [],
        summary: {type: String},
        region: {type: String},
        author: {type: String}
    }],
    popularSlideshows: [{
        short_title: {type: String},
        image: [],
        sub_subs: {type: String}
    }]            
    
});
var Token = mongoose.model('siteconfig', sitepageconfigSchema);