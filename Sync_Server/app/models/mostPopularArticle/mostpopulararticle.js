var mongoose = require('mongoose');
var path = require('path');
var mostpopulararticleSchema = mongoose.Schema({
    articleId: {type: String},
    article_page: {type:String},
    all_time_most_popular_article:[{
      title: {type: String},
      
      author_article: [{fullName: {type:String}}],
      files:[],
      category_type_article:{type:String},
      views:{type:String},
      articleId: {type:String}
    }],   
    current_month_most_popular:[{
      title: {type: String},
      
      author_article: [{fullName: {type:String}}],
      files:[],
      category_type_article:{type:String},
      views:{type:String},
      articleId: {type:String}
    }], 
    current_week_most_popular:[{
      title: {type: String},
      
      author_article: [{fullName: {type:String}}],
      files:[],
      category_type_article:{type:String},
      views:{type:String},
      articleId: {type:String}
    }], 
    current_date_most_popular:[{
      title: {type: String},
      
      author_article: [{fullName: {type:String}}],
      files:[],
      category_type_article:{type:String},
      views:{type:String},
      articleId: {type:String}
    }],                               
    
});
var mostpopulararticleconfig = mongoose.model('articleDetailsModel', mostpopulararticleSchema);