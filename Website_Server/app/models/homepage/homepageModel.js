var mongoose = require('mongoose');
var path = require('path');
var userSchema = require(path.join(__dirname, 'users', 'users'));
var homepageconfigSchema = mongoose.Schema({
    articleId: {type: String},
    country_abb: {type: String},
    sliders: [{
        author: userSchema,
        country_abb: {type: String},
        image: [],
        sub_cat_label: {type: String},
        short_title: {type: String},
        summary: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
     }],
     features: [{
        author: userSchema,
        country_abb: {type: String},
        image: [],
        sub_cat_label: {type: String},
        short_title: {type: String},
        summary: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
     }],
    trending: [{
        author: userSchema,
        country_abb: {type: String},
        short_title: {type: String},
        image: [],
        sub_subs: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
    }],
    topGlobalStories: [{
        author: userSchema,
        country_abbs: {type: String},
        short_title: {type: String},
        image: [],
        summary: {type: String},
        date_stamp: {type: String},
        region: {type: String},
        pos: {type: String}
    }],
    popularSlideshows: [{
        country_abb: {type: String},
        short_title: {type: String},
        image: [],
        sub_subs: {type: String},
        pos: {type: String}
    }]            
    
});
var Token = mongoose.model('homepageconfig', homepageconfigSchema);