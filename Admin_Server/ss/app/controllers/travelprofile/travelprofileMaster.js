
var path = require('path');

var travelprofileDetails = require(path.join(__dirname, 'admin', 'travelprofile'));
/* Event  Managment - Admin 
 * */
exports.travelprofileUsers = travelprofileDetails.travelprofileUsers;
//exports.getAuthor = authorBasic.getAuthor;
