var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');
const shortid = require('shortid');
var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
const mongoosePaginate = require('mongoose-paginate');

var customerSchema = mongoose.Schema({
    _id: {type: String},
    customers: [{
        customerId : {type:String},
        email: { type: String, required: true },
        phoneNo: { type: String, required: true },
        fullName: {type:String},
        salt: { type: String },
        hashedPwd: { type: String },
        added_date: { type: Date, default: Date.now },
        shippingAddress: [{
            contactPerson: { type: String, required: true },
            contactPerson_ph_1: { type: String, required: true },
            contactPerson_ph_2: { type: String},
            email: { type: String },
            pinCode: { type: String, required: true },
            addr_ln_1: { type: String, required: true },
            addr_ln_2: { type: String },
            landMark: { type: String },
            city: { type: String },
            state: { type: String, required: true },
            pinCode: { type: String, required: true },
            pinCode: { type: String, required: true },
            added_date: { type: Date, default: Date.now }
        }]
    }]
});

// customerSchema.methods = {
//     authenticate: function(passwordToMatch) {
//         return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashedPwd;
//     }
// }
customerSchema.plugin(mongoosePaginate);
var customerModel = mongoose.model('customerModel', customerSchema);