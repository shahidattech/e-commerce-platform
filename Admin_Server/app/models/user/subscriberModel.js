var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');
const shortid = require('shortid');
var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
var profileSchema = require(path.join(__dirname, 'profile', 'common', 'profileSchema'));

var roleFeatureSchema = mongoose.Schema({
    feature: { type: String, required: true },
    hasAccess: { type: Boolean, required: true, default: false }
}, { _id: false });

var subscriberSchema = mongoose.Schema({
    profile: profileSchema, //User Profiles
    userName: { type: String, required: true }, 
    salt: { type: String, required: true },
    fullName: {type:String},
    userId: {type: String,default: shortid.generate},
    phoneNo: {type: String, required: true},
    hashedPwd: { type: String, required: true },
    active: { type: Boolean},
    //guide: { type: Boolean, default: true },
    dateOfRegistration: { type: Date, default: Date.now },
    scKey: { type: String },
    scHash: { type: String },
    scProvider: { type: String }
});

subscriberSchema.methods = {
    authenticate: function(passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
    }
}

var SubscriberModel = mongoose.model('SubscriberModel', subscriberSchema);

function findUser(query) {
    return Promise.cast(SubscriberModel.find(query).exec());
}