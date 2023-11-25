var path = require('path');

var articleBasic = require(path.join(__dirname, 'admin', 'articleBasicCtrl'));
/* Article  Managment - Admin 
 * */
exports.createArticle = articleBasic.createArticle;
//exports.getArticle = articleBasic.getArticle;
exports.updatearticle = articleBasic.updatearticle;
exports.getArticleByUserId = articleBasic.getArticleByUserId;
exports.deleteArticle = articleBasic.deleteArticle;
exports.getArticleByArticleId = articleBasic.getArticleByArticleId;
exports.getArticle = articleBasic.getArticle;

exports.getArticleByCountry = articleBasic.getArticleByCountry;
exports.updatePosition = articleBasic.updatePosition;