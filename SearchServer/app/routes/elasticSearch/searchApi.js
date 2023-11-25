var Path = require('path');
var productSearch = require(Path.join(__dirname, '..', '..', 'controllers', 'productCtrl'));
module.exports = function(app) {
    app.get('/api/search/productSearch', productSearch.productkeywordsSearch);
   // app.post('/api/search/getclassdetails', Search.getClassDetails)

}; 
  