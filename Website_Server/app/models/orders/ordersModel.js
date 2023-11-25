var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var orderSchema = mongoose.Schema({
    _id: { type: String },
    customers: [{
        customerId: { type: String },
        orders:[        
            {
                orderId: { type: String },
                added_date: { type: Date, default: Date.now },
                orderDetails : {
                    products :[{
                        productId : { type: String },
                        quantity : { type: Number},
                        title: { type: String},
                        mainImageUrl: {type: String},
                        price: { type: Number },
                        weight: { type: String },
                        unit: { type: String },
                        gst: { type: String }
                    }]
                },
                shippingDetails: {
                    customerName : { type: String },
                    addressLine1 : { type: String },
                    addressLine2 : { type: String },
                    pinCode : { type: String },
                    state : { type: String },
                    city : { type: String },
                    landMark : { type: String },
                    phoneNumber : { type: String },
                    alterNativeNumber: { type: String },
                    email: { type: String}
                },
                paymentDetails : {
                    paymentMode : { type: String, enum: ['COD', 'PREPAID']},
                    paymendStatus : { type: String, enum: ['COMPLETED', 'PENDING'], default: 'PENDING'},
                    payment_date: { type: Date },
                    paymentInfo: {
                        vendorName: { type: String},
                        mihpayid: { type: String},
                        status: { type: String},
                        txnid: { type: String},
                        amount: { type: String},
                        addedon: { type: String},
                        bankcode: { type: String},
                        payuMoneyId: { type: String},
                        net_amount_debit: { type: String}
                    }
                },
                additionalDetails: {
                    courier_company_id: { type: String},
                    courier_rate: { type: String},
                    order_amount: { type: String},
                },
                orderStatus: { type: String, default: 'new' },
                Awb_Number: { type: String, default: 'NOTSET' }
            }
        ]
    }]

});
orderSchema.plugin(mongoosePaginate);
var orderModel = mongoose.model('orderModel', orderSchema);




