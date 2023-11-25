var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');

// var autherSchema = require(path.join(__dirname, '..', 'user', 'userModel'));
 var artworkSchema = require(path.join(__dirname, 'artwork', 'artworkSchema'));

var slideShowSchema = mongoose.Schema({
        title: {type: String},
        createrId: {type: String},
        shortTitle: {type: String},
        slideshow_page: {type:String},
        //categoryRadio: {type:String,},
        category_type_article:{type:String},
        language:{type: String},
        
        added_date:{type: Date,default: Date.now},
       
        slideshow_carousel: [{
            image_caption: {type: String},
            _id:false,
            image_credit:{type:String},
            imageTitle:{type:String},  
            alt_text:{type:String}  
        }],
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
       views:{type:Number,default:0},
     timestamp: {type:Date,default: Date.now    },
        PerformanceChannels: [
            { Film: {type:Boolean},
            Music: {type:Boolean},
            Television: {type:Boolean},
            'Theatre & Dance': {type:Boolean},
             _id:false  
        }],
        
        LifesytlesChannels: [
            { 'Food & Wine': {type:Boolean},
            'Jewelry & Watches': {type:Boolean},
            'Autos & Boats': {type:Boolean},
            Auctions: {type:Boolean},
             _id:false  
        }],
        
        FashionChannels: [
            { 'Designer Spotlight': {type:Boolean},
            Runway: {type:Boolean},
             StyleGuide: {type:Boolean},
            Accessories: {type:Boolean},
             _id:false  
        }],
        
        TravelChannels: [
            {  Inspiration: {type:Boolean},
            Video: {type:Boolean},
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
        
        genu_res:[{ 'Contemporary Art': {type:Boolean},
              'Old Masters & Renaissance': {type:Boolean},
              'Impressionism & Modern Art': {type:Boolean},
              Traditional: {type:Boolean},
              Antiquities: {type:Boolean},
               _id:false
               }],
              
        files:[],
        Published:{type:Boolean},
        author_article: [{
            fullName: {type: String},
            phoneNo:{type:String},
            userName: {type:String},
            userRole: {type:String}
        }],
        relatedArticle:[{
          title: {type: String},
          articleId: {type: String,default: shortid.generate},
          createrId: {type: String},
          short_title: {type: String},
          summary: {type: String},
          tags: [{NewTag: {type:String}}],
          _id:false
        }],
        serach_artwork:artworkSchema,
        ReferenceArtist: [{
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
         referencevenue: [{
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
        referenceEvents: [{
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
        description:{type:String},
        order:{type:String},
        cover_image:[{
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
         createdBy:{type:String}       

   // }
});

var slideShowModel = mongoose.model('slideShowModel', slideShowSchema);

