var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');

var EntityLocationProfileSchema = mongoose.Schema({
     entityType: {type: String},
     language:{type:String},
     entityName: {type:String},
     websiteTitle:{type:String},
     added_date:{type: Date,default: Date.now},
     
     websiteurl:{type:String},
     facebookWebsite:{type:String},
     twitterWebsite:{type:String},
     googlePlusWebsite:{type:String},
     briefInfo:{type:String},
     specialties:[{type:String}],
     locationName:{type:String},
     files:[],
     street:{type:String},
     additional:{type:String},
     country:{type:String},
     stateProvince:{type:String},
     city:{type:String},
     postalCode:{type:String},
     latitude:{type:String},
     longitude:{type:String},
     neighborhood:{type:String},
     locationPhone:{type:String},
     locationFax: {type:String},
     locationEmail: {type:String},
     openingHoursAlternative:{type:String},
     region:{type:String},
     contract_Notes:{type:String},
     contract_Description:{type:String},
     contract_Representative:{type:String},
     CEO_Name:{type:String},
     CEO_ChiefMarketingOfficer:{type:String},
     CEO_HeadquartersCityOrCountry:{type:String},
     CEO_EventLocation:{type:String},
     seo_description:{type:String},
     seo_Keywords:{type:String},
     tags:{type:String},
     url_alias:{type:String},
     revisionLogMessage:{type:String},
     authored_by:{type:String},
     authored_on:{type:String},
     publishOption:[{type:String}],
     createdBy:{type:String}
    });

var EntityLocationProfileModel = mongoose.model('EntityLocationProfileModel', EntityLocationProfileSchema);
