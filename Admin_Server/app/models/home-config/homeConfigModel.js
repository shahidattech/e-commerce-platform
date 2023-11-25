var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var homeConfigSchemaTheme1 = mongoose.Schema({
    _id: {type: String},
    userId: { type: String },
    sections: [],
    cat_subCat_subSubCat: [
        {
            categoryId: { type: String },
            categoryName: { type: String },
            sub_categories: [{
                subCategoryId: { type: String },
                subCategoryName: { type: String },
                sub_sub_categories: [
                    {
                        subSubCategoryId: { type: String },
                        subSubCategoryName: { type: String }
                    }
                ]
            }]
        }
    ],
    storeGeneralInfo:{
        imageLogo: {type: String},
        brandName: {type: String},
        facebookUrl: {type: String},
        instagramUrl: {type: String},
        twitterUrl: {type: String},
        phoneNumber: {type: String},
        whatsApp : {type: String},
        email: {type: String},
        pinCode: {type: String},
        state: {type: String},
        storePhysicalAddress: {type: String},
        gstNo: {type: String},
        panNo: {type: String},
        cin: {type: String},
        enableForCOD: {type: Boolean, default: true},
        enableForOnlinePayment: {type: Boolean, default: true},
        onlinePaymentMethod: {type: String},
        enableForEmailNotificationonOrder: {type: Boolean, default: false},
        enableForSMSNotificationonOrder: {type: Boolean, default: false},
        enableForSMSNotificationonDispatch: {type: Boolean, default: false},
        enableForShippingChargesCollect: {type: Boolean, default: true},
        googlePayNo: {type: String},
        phonePayNo: {type: String},
        paytmNo: {type: String},
        orderTemplate: {type: String},
        aboutUs: {type: String},
        headerColor: {type: String}
    },
    updated_date: { type: Date, default: Date.now },
});
homeConfigSchemaTheme1.plugin(mongoosePaginate);

var homeConfigSchemaTheme2 = mongoose.Schema({
    userId: { type: String },
    sections: [],
    cat_subCat_subSubCat: [
        {
            categoryId: { type: String },
            categoryName: { type: String },
            sub_categories: [{
                subCategoryId: { type: String },
                subCategoryName: { type: String },
                sub_sub_categories: [
                    {
                        subSubCategoryId: { type: String },
                        subSubCategoryName: { type: String }
                    }
                ]
            }]
        }
    ],
    storeGeneralInfo:{
        imageLogo: {type: String},
        brandName: {type: String},
        instagramUrl: {type: String},
        twitterUrl: {type: String},
        phoneNumber: {type: String},
        whatsApp: {type: String},
        email: {type: String},
        storePhysicalAddress: {type: String},
        gstNo: {type: String},
        panNo: {type: String},
        cin: {type: String},
    },
    updated_date: { type: Date, default: Date.now }
});


homeConfigSchemaTheme2.plugin(mongoosePaginate);
var homeConfigTheme1Model = mongoose.model('homeConfigTheme1', homeConfigSchemaTheme1);
var homeConfigTheme2Mode2 = mongoose.model('homeConfigTheme2', homeConfigSchemaTheme2);




