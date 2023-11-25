var path = require('path');
var eventCtrl = require(path.join(__dirname, '..', '..', 'controllers', 'events', 'eventsMaster'));
//var eventCtrls = require(path.join(__dirname, '..', '..', 'controllers', 'events', 'admin', 'event'));

module.exports = function(app, upload) {

   var default_url_path = '/api/v1/event/'
   app.post(default_url_path + 'createevents', eventCtrl.eventUsers);
   //app.get(default_url_path + 'getEvents', eventCtrl.eventUsers);
   //app.post(default_url_path + 'getTag');
  app.get(default_url_path + 'getEvents',  eventCtrl.getEvents);
  app.get(default_url_path + '/photo/:id',  eventCtrl.getPhotos);
  app.get(`${default_url_path}getEventByUserId/:userId`,eventCtrl.getEventByUserId)
  app.get(`${default_url_path}getEventByEventId/:eventId`,eventCtrl.getEventByEventId);
  app.post(`${default_url_path}updateEvent`,eventCtrl.updateEvent);
  app.del(default_url_path + 'deleteEvents/:eventId', eventCtrl.deleteEvents);
}

