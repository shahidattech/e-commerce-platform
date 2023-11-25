var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var paymentKeysSchema = mongoose.Schema({
    userId: { type: String},
    payUMerchantKey: { type: String, required: true  },
    payUMerchantSalt: { type: String, required: true  },
    payUMerchantHeader: { type: String , required: true },
    updated_date: { type: Date, default: Date.now },
});

var paymentKeysModel = mongoose.model('paymentKeysModel', paymentKeysSchema);




