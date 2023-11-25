
const fs = require('fs');
var mongoose = require('mongoose');
//var User = require('../models/photo.js');
var User = require('mongoose').model('User');

exports.uploadFile = (req, res) => {
	var new_user = new User({
	     title: req.body.title,
		 short_title: req.body.short_title,
		 summary: req.body.summary,
		 tags: req.body.tags,
		 files: req.files
		// otherfiles: req.files
	});
	
	new_user.save(function(err){
	  if(err) console.log('dd' + err); 
	});
	// log applicationForm
	console.log(JSON.stringify(new_user, null, 4));
	
	res.send(new_user);
}
