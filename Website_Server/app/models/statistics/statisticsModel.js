var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');
const shortid = require('shortid');

var statisticsSchema = mongoose.Schema({
    _id: {type: String},
    stat: [{
        currentDate: {type :String},
        orderCount : {type:Number},
        customerCount : {type:Number},
        rnrCount : {type:Number},
        productCount : {type:Number},
        added_date: { type: Date, default: Date.now }
    }] 
});
var statisticsModel = mongoose.model('statisticsModel', statisticsSchema);