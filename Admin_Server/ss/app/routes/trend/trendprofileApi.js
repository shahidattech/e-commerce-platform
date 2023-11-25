var path = require('path');
var trendprofileCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'trend', 'trendMaster'));

module.exports = function(app, upload) {

   var default_url_path = '/api/v1/trend/'
   app.post(default_url_path + 'trendprofile', upload.fields([
            { name: 'main_trends_photos', maxCount: 1 } 
        ]), trendprofileCtrl.trendUsers);
   app.get(default_url_path + 'getTrendByUserId/:userId', trendprofileCtrl.getTrendByUserId);
   app.get(default_url_path + 'getTrend', trendprofileCtrl.getTrends);
   app.del(default_url_path + 'deleteTrend/:TrendId', trendprofileCtrl.deleteTrend);
   app.get(default_url_path + 'getTrendByTrendId/:trendId', trendprofileCtrl.getTrendByTrendId);
  // app.get(default_url_path + 'getauthor', authorCtrl.getAuthor);
}

