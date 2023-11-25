
var path = require('path');

var authorBasic = require(path.join(__dirname, 'admin', 'authorBasicCtrl'));
/* Article  Managment - Admin 
 * */
exports.createAuthor = authorBasic.createAuthor;
exports.getAuthor = authorBasic.getAuthor;
