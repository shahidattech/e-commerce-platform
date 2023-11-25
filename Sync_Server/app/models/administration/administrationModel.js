var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');


var administrationSchema = mongoose.Schema({
     active: {type: Boolean},
     role:[{type:String}],
     userId: {type:String}
     //authorDescription: {type:String}
    
});

var administrationModel = mongoose.model('administrationModel', administrationSchema);
