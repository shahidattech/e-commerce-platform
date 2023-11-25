
var path = require('path');

var eventDetails = require(path.join(__dirname, 'admin', 'event'));
/* Event  Managment - Admin 
 * */
exports.eventUsers = eventDetails.eventUsers;
exports.getEvents = eventDetails.getEvents;
//exports.getAuthor = authorBasic.getAuthor;
exports.getEventByUserId = eventDetails.getEventByUserId;
exports.getEventByEventId = eventDetails.getEventByEventId;
exports.updateEvent = eventDetails.updateEvent;
exports.deleteEvents=eventDetails.deleteEvents;
exports.getPhotos = eventDetails.getPhotos;