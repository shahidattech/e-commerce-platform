var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');

var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
var profileSchema = require(path.join(__dirname, 'profile', 'common', 'profileSchema'));

var roleFeatureSchema = mongoose.Schema({
    feature: { type: String, required: true },
    hasAccess: { type: Boolean, required: true, default: false }
}, { _id: false });

var userSchema = mongoose.Schema({
    profile: profileSchema, //User Profiles
    userName: { type: String, required: true }, 
    salt: { type: String, required: true },
    hashedPwd: { type: String, required: true },
    userRole: { type: String, required: true },
    messages: [{ type: String }],
    features: [roleFeatureSchema],
    active: { type: Boolean, required: true },
    guide: { type: Boolean, default: true },
    dateOfRegistration: { type: Date, default: Date.now },
    scKey: { type: String },
    scHash: { type: String },
    scProvider: { type: String }
});

userSchema.methods = {
    authenticate: function(passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
    }
}

var User = mongoose.model('User', userSchema);

function findUser(query) {
    return Promise.cast(User.find(query).exec());
}