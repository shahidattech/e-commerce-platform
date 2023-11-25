var path = require('path');

var custBasic = require(path.join(__dirname, 'admin', 'customerBasicCtrl'));
/* Article  Managment - Admin 
 * */

exports.createCustomer = custBasic.createCustomer; 
exports.getCustomerByCustId = custBasic.getCustomerByCustId;
