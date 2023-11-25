var mongoose = require('mongoose');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment-timezone');

var subscriptionSchema = mongoose.Schema({
    _id: { type: String },
    added_date: { type: Date, default: Date.now },
    subscription_added_date: { type: String, default: moment.tz("Asia/Kolkata").format('DD-MM-YYYY') },
    subscription_expire_date: { type: String, default: null },
    subscription_added_time: { type: String, default: moment().tz('Asia/Kolkata').format('H:mm:ss') },
    subscription_expire_time: { type: String, default: null },
    amount: { type: Number, default: 0 },
    gst_percentage: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    noOfMonths: { type: Number, default: 0 },
    noOfDays: { type: Number, default: 0 },
    prevAmount: { type: Number, default: 0 },
    lastTxn: { type: String, default: null },
    plan: {type: String, default: null},
    history: [],
    extraInfo: []
});
subscriptionSchema.plugin(mongoosePaginate);
var sucscriptionModel = mongoose.model('Subscription', subscriptionSchema);




