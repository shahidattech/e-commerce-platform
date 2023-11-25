var path = require('path');

var invoiceBasic = require(path.join(__dirname, 'admin', 'invoiceBasicCtrl'));
/* Article  Managment - Admin 
 * */

exports.generateGSTInvoice = invoiceBasic.generateGSTInvoice
