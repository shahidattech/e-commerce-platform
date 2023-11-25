
var path = require('path');

var trendDetails = require(path.join(__dirname, 'admin', 'trendBasic'));
/* Event  Managment - Admin 
 * */
exports.trendUsers = trendDetails.trendUsers;
exports.getTrendByUserId = trendDetails.getTrendByUserId;
exports.getTrends = trendDetails.getTrends;
exports.deleteTrend = trendDetails.deleteTrend;
exports.getTrendByTrendId = trendDetails.getTrendByTrendId;

//exports.getAuthor = authorBasic.getAuthor;
