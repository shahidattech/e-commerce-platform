var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');
// var autherSchema = require(path.join(__dirname, '..', 'user', 'userModel'));
// var storySchema = require(path.join(__dirname, '..', 'story', 'storyModel'));
var imageSchema = require(path.join(__dirname,  'articleImageModel'));
var eventsSchema = require(path.join(__dirname, 'events', 'events'));
var userSchema = require(path.join(__dirname, 'users', 'users'));
var artistsSchema = require(path.join(__dirname, 'artists', 'artists'));
var venuesSchema = require(path.join(__dirname, 'venues', 'venues'));
var slideshowSchema = require(path.join(__dirname, 'slideShow', 'slideShowSchema'));
var articleSchemas = require(path.join(__dirname, 'article', 'articleSchema'));
var tagsSchemas = require(path.join(__dirname, 'tags', 'tagschema'));

var articleSchema = mongoose.Schema({
        title: {type: String,required:true},
        articleId: {type: String,default: shortid.generate},
        createrId: {type: String},
        Books:{type:Boolean},
        seo_keywords:{type:String},
        views:{type:Number,default:0},
        article_page: {type:String},
        uploadFiles:{type:String},
        short_title: {type: String,required:true},
        summary: {type: String,required:true},
        tags:{type:tagsSchemas},
        //categoryRadio: {type:String,},
        para_data: [{
            para_body: {type:String,},
            para_head: {type:String,},
            para_img:{type:String},
            para_img_cap_credit: {type:String,},
            para_image_title: {type:String,},
            para_alt_text:{type:String},
            _id:false
        }],
        added_date:{type: Date,default: Date.now},
        image_caption: {type: String},
        image_credit: { type:String},
        imageTitle: {type: String},
        alt_text: {type: String},
        // cat{catID:"val"{
        //     {
                
        //     }
        // }}
        
        All_country: [{ All: {type:Boolean},
            International: {type:Boolean},
            Australia: {type:Boolean},
            Canada: {type:Boolean},
            China: {type:Boolean},
            France: {type:Boolean},
            Germany: {type:Boolean},
            HongKong: {type:Boolean},
            India: {type:Boolean},
            Italy: {type:Boolean},
            Japan: {type:Boolean}, 
            Korea: {type:Boolean},
            MiddleEast: {type:Boolean},
            Spain: {type:Boolean},
            Uk: {type:Boolean},
             _id:false
        }],
       ArchitectureChannels: [{ Architecture: {type:Boolean},
          Design: {type:Boolean},
          'Home & Interiors': {type:Boolean},
           _id:false  
      }],
  referenceSlideShow:[],
      ArchitectureSubs: [
          { News: {type:Boolean},
          Reviews: {type:Boolean},
          Video: {type:Boolean},
           _id:false  
      }],
      PerformanceChannels: [
          { Film: {type:Boolean},
          Music: {type:Boolean},
          Television: {type:Boolean},
          'Theatre & Dance': {type:Boolean},
           _id:false  
      }],
      PerformanceSubs: [
          { News: {type:Boolean},
          Reviews: {type:Boolean},
          Video: {type:Boolean},
          Parties: {type:Boolean},
           _id:false  
      }],
      LifesytlesChannels: [
          { 'Food & Wine': {type:Boolean},
          'Jewelry & Watches': {type:Boolean},
          'Autos & Boats': {type:Boolean},
          'Auctions': {type:Boolean},
           _id:false  
      }],
      LifesytlesSubs: [
          { News: {type:Boolean},
          Video: {type:Boolean},
          Parties: {type:Boolean},
           _id:false  
      }],
      FashionChannels: [
          { 
          'Designer Spotlight': {type:Boolean},
          Runway: {type:Boolean},
          'Style Guide': {type:Boolean},
          Accessories: {type:Boolean},
          Exhibitions: {type:Boolean},
           _id:false  
      }],
      FashionSubs: [
          { News: {type:Boolean},
          Reviews: {type:Boolean},
          Video: {type:Boolean},
          Parties: {type:Boolean},
           _id:false  
      }],
      TravelChannels: [
          {  Inspiration: {type:Boolean},
          Destinations: {type:Boolean},
           People: {type:Boolean},
           _id:false  
      }],
       TravelSubs: [
          {  'Cultural Experiences': {type:Boolean},
           'Hotels & Resorts': {type:Boolean},
           Shopping: {type:Boolean},
           'Food & Wine': {type:Boolean},
            'When In': {type:Boolean},
           'Cue the Concierge': {type:Boolean},
           'The Resident': {type:Boolean},
            'The Venturer': {type:Boolean},
           'Mr. Tripper': {type:Boolean},
           _id:false  
      }],
      sub_channel: [{ Fairs: {type:Boolean},
          Auctions: {type:Boolean},
          Galleries: {type:Boolean},
          Museums: {type:Boolean},
          Columnist: {type:Boolean},
          Features: {type:Boolean},
           _id:false }],
      sub_subs: [{ News: {type:Boolean},
          Previews: {type:Boolean},
          Reviews: {type:Boolean},
          Parties: {type:Boolean},
          Videos: {type:Boolean},
           _id:false  
      }],
      genu_res:[{ 'Contemporary Art': {type:Boolean},
            'Old Masters & Renaissance': {type:Boolean},
            'Impressionism & Modern Art': {type:Boolean},
            Traditional: {type:Boolean},
            Antiquities: {type:Boolean},
             _id:false
             }],
        files:[],
        category_type_article: {type:String,required:true},
        saveDrafts:{type:String},
        Published:{type:String},
        author_article: {type:userSchema,required:true},
        artistData: {type:artistsSchema,required:function () {
            return this.ReferenceArtist != true
          }},
        referencevenue:{type:venuesSchema,required:function () {
            return this.ReferenceVenue != true
          }},
        referenceEvents:eventsSchema,
        auctionResults: [{
         artistName: {type: String},
         language:{type:String},
         artist: {type:String},
         articleDescription: {type:String},
         location: {type: String},
         street_location:{type:String},
         Additional: {type:String},
         Neighborhood: {type:String},
         Country: {type:String},
          _id:false
        }],
        recommendArticles: tagsSchemas,
        automaticRecommendedArticles:articleSchemas,
        automaticRecommendedSlideShow:slideshowSchema,
        automaticRecommendedEvent:eventsSchema,
        automaticRecommendedArtist: artistsSchema,
        slider_carousel: [{
            enable_inq: {type:Boolean},
            imageCaption:{type:String},
            ImageCredit:{type:String},
            slideer_img:{type:String},
            ImageTitle:{type:String},
            AltText:{type:String},
             _id:false
        }],
        globalarticleRegion: {type: String,required:true},
        GlobalRegion: {type: String},
        ReferenceVenue: {type:Boolean},
        ReferenceArtist: {type:Boolean}

   // }
});
articleSchema.plugin(mongoosePaginate);
var articleImageModel = mongoose.model('articleModel', articleSchema);




