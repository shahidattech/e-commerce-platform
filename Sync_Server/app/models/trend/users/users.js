var path = require('path');
var profileSchema = require(path.join(__dirname, '..', 'profile', 'common', 'profileSchema'));
module.exports= [{
	profile: profileSchema, //User Profiles
    userName: { type: String, required: true }, 
    salt: { type: String, required: true },
    fullName: {type:String},
   // userId: {type: String,default: shortid.generate},
    phoneNo: {type: String, required: true},
    hashedPwd: { type: String, required: true },
    userRole: { type: String },
    personal_information: {
        field_state: {type: String},
        gender: {type: String},
        field_year_of_birth: {type: String},
        field_zip_code: {type: String},
        field_household_income: {type: String},
        field_country: {type: String},
        field_job_experience: {type: String},
        field_job_industry: {type: String}
    },
    artinfo_url: {
        field_artinfo_newsletter:{type:Boolean},
        field_art_fair_reports:{type:Boolean},
        field_offer_lbm:{type:Boolean},
        field_offer_lbf:{type:Boolean},
        field_offer_artinfo:{type:Boolean},
        field_art_auction:{type:Boolean},
        field_modern_painters:{type:Boolean},
        field_gallery_guide:{type:Boolean},
        field_alerts:{type:Boolean},
    },
    recent_comments: {
        Contact: {type:Boolean},
        language: {type: String},
        timezone: {type: String},
        block: {type: Boolean},
        mimemail_textonly: {type: Boolean},
        field_address: {type: String},
        field_city: {type: String},
        field_phone: {type: String},
        field_more_microsites: {type: Boolean},
        field_terms_conditions: {type: Boolean},
        field_user_company_profile:{type:Boolean},
        group_audience: {type: String},
        field_profile_public: {type: Boolean},
        field_position:{type:String}
    },
   // messages: [{ type: String }],
    //features: [roleFeatureSchema],
    active: { type: Boolean},
    //guide: { type: Boolean, default: true },
    dateOfRegistration: { type: Date, default: Date.now },
    scKey: { type: String },
    scHash: { type: String },
    scProvider: { type: String }
}]