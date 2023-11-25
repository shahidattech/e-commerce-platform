var path = require('path');

var orderBasic = require(path.join(__dirname, 'admin', 'ordersBasicCtrl'));
/* Article  Managment - Admin 
 * */

exports.getOrderByUserId = orderBasic.getOrderByUserId;
exports.updateOrderStatus = orderBasic.updateOrderStatus;
exports.getPendingOrdersByUserId = orderBasic.getPendingOrdersByUserId;
exports.getshippiedOrdersByUserId = orderBasic.getshippiedOrdersByUserId;
exports.pendingOrderPaymentStatusComplete = orderBasic.pendingOrderPaymentStatusComplete;
exports.getOrderByDate = orderBasic.getOrderByDate;