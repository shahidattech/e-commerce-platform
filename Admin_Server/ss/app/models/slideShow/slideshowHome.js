var mongoose = require('mongoose');
var path = require('path');
//var userSchema = require(path.join(__dirname, 'users', 'users'));
var homepageslideshowconfigSchema = mongoose.Schema({
    slideshowId: {type: String},
    country_abb: {type: String},
    added_date: {type: Date},
    popularSlideshows: [{
        country_abb: {type: String},
        title: {type: String},
        image: [],
        views:{type:Number,default:0},
        timestamp: {type:Date,default: Date.now    },
        pos:{type: String}
    }]            
    
});
var Token = mongoose.model('homepageslideshowconfig', homepageslideshowconfigSchema);