var path = require('path');

var productBasic = require(path.join(__dirname, 'admin', 'productBasicCtrl'));
var productUpdateBasic = require(path.join(__dirname, 'admin', 'productUpdateBasicCtrl'));
/* Article  Managment - Admin 
 * */
exports.createProduct = productBasic.createProduct;
exports.getProductsByUserId = productBasic.getProductsByUserId;
exports.delectProductsById = productBasic.delectProductsById;
exports.getProducts = productBasic.getProducts;
exports.saveProductinCatSubcatSubSubCat = productBasic.saveProductinCatSubcatSubSubCat;
exports.getProductsByProductIdUserId = productBasic.getProductsByProductIdUserId;
// exports.updateProduct = productBasic.updateProduct;
exports.updateProduct = productUpdateBasic.updateProduct;
exports.getReviewedProducts = productBasic.getReviewedProducts;
exports.updateReviewedProducts = productBasic.updateReviewedProducts;