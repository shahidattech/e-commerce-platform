
var path = require('path');

var travelcityDetails = require(path.join(__dirname, 'admin', 'travelcityBasicCtrl'));
/* Event  Managment - Admin 
 * */
exports.travelcityUsers = travelcityDetails.travelcityUsers;
//exports.getAuthor = authorBasic.getAuthor;
