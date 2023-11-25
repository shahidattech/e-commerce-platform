var path = require('path');
//var profileSchema = require(path.join(__dirname, '..', 'profile', 'common', 'profileSchema'));
module.exports= [{
//	profile: profileSchema, //User Profiles
    userName: { type: String, required: true }, 
    salt: { type: String, required: true },
    fullName: {type:String},
  
}]