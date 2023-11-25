var path = require('path');
var entitylocationprofileCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'entitylocationprofile', 'entitylocationprofileBacisCtrl'));

module.exports = function(app) {

   var default_url_path = '/api/v1/entityLocation/'
   app.post(default_url_path + 'createEntityLocationProfile', entitylocationprofileCtrl.createEntityLocationProfile);
   app.get(default_url_path + 'getvenue', entitylocationprofileCtrl.getvenue);
   app.get(`${default_url_path}getVenueByUserId/:userId`,entitylocationprofileCtrl.getVenueByUserId);
   app.post(`${default_url_path}updateVenue`,entitylocationprofileCtrl.updateVenue);
   app.get(`${default_url_path}getentityLocationByEntityId/:entityId`,entitylocationprofileCtrl.getentityLocationByEntityId)
}

