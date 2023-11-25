var path = require('path');

var orderBasic = require(path.join(__dirname, 'admin', 'ordersBasicCtrl'));
/* Article  Managment - Admin 
 * */

exports.placeAnOrder = orderBasic.placeAnOrder; 
exports.getOrderByUserId = orderBasic.getOrderByUserId;
exports.cancelOrder = orderBasic.cancelOrder;