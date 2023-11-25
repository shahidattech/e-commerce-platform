
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    title: String,
	short_title: String,
	summary: String,
	tags: String,
	files: []
	//otherfiles:[]
});
module.exports = mongoose.model('users', userSchema);  

// make this available to our users in our Node applications

