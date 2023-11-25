var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// const mongoosePaginate = require('mongoose-paginate-v2');

var invoiceSchema = mongoose.Schema({
    _id: { type: String },
    invoices:[{
        year_month:{type: String, required: true},
        total_sale_value: {type:Number},
        total_tax:{type:Number},
        cgst:{type:Number},
        sgst:{type:Number},
        invoiceURL: {type :String},
        added_date: { type: Date, default: Date.now },
    }]
}); 
invoiceSchema.plugin(mongoosePaginate);
var invoiceModel = mongoose.model('invoiceModel', invoiceSchema);




