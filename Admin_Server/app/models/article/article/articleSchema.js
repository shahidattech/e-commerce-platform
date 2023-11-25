var path = require('path');
var tagsSchemas = require(path.join(__dirname, '..', 'tags', 'tagschema'));
var userSchema = require(path.join(__dirname, '..','users', 'users'));


module.exports = [{
 title: {type: String},
 summary: {type: String},
 added_date:{type: Date,default: Date.now},
 files:[], 
 author_article: userSchema
 }]
