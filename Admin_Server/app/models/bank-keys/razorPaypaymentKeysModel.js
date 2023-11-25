var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var paymentKeysSchema = mongoose.Schema({
    userId: { type: String},
    key_id: { type: String, required: true  },
    key_secret: { type: String, required: true  },
    updated_date: { type: Date, default: Date.now },
});

var razorPaypaymentKeysModel = mongoose.model('razorPaypaymentKeysModel', paymentKeysSchema);




