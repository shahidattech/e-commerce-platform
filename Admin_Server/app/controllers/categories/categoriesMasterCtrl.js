var path = require('path');

var categoriesBasic = require(path.join(__dirname, 'admin', 'categoriesBasicCtrl'));

exports.getCategories = categoriesBasic.getCategories;
exports.getCatSubCatSubSub = categoriesBasic.getCatSubCatSubSub