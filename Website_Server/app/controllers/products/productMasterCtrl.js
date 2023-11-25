var path = require('path');

var productBasic = require(path.join(__dirname, 'admin', 'productBasicCtrl'));
/* Article  Managment - Admin 
 * */

exports.getProductByID = productBasic.getProductByID;
exports.getCategories = productBasic.getCategories;
exports.getProductByCategoryID = productBasic.getProductByCategoryID;
exports.getProductBySubCategoryID = productBasic.getProductBySubCategoryID;
exports.getProductBySubSubID = productBasic.getProductBySubSubID;
exports.addRatingAdnReviews = productBasic.addRatingAdnReviews;