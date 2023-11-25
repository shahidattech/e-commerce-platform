var mongoose = require('mongoose');
var path = require('path');
var mostpopulararticleSchema = mongoose.Schema({
    articleId: {type: String},
    article_page: {type:String},
    most_popular_article:[{
      title: {type: String},
      image: [],
      views:{type:String},
      articleId: {type:String}
    }],                             
    
});
var mostpopulararticleconfig = mongoose.model('mostpopulararticleconfig', mostpopulararticleSchema);