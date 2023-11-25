var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');

// var autherSchema = require(path.join(__dirname, '..', 'user', 'userModel'));
// var storySchema = require(path.join(__dirname, '..', 'story', 'storyModel'));
var imageSchema = require(path.join(__dirname,  'articleImageModel'));
var eventsSchema = require(path.join(__dirname, 'events', 'events'));
var userSchema = require(path.join(__dirname, 'users', 'users'));
var artistsSchema = require(path.join(__dirname, 'artists', 'artists'));
var venuesSchema = require(path.join(__dirname, 'venues', 'venues'));

var articleSchema = mongoose.Schema({
        title: {type: String},
        articleId: {type: String,default: shortid.generate},
        createrId: {type: String},
        short_title: {type: String},
        summary: {type: String},
        tags: [{NewTag: {type:String}}],
        //categoryRadio: {type:String,},
        AddImgParagraph: [{
            image_caption_para: {type:String,},
            para_head: {type:String,},
            Para_img_cap_credit: {type:String,},
            image_title_paragraph: {type:String,},
            image_alt_paragraph:{type:String},
            _id:false
        }],
        added_date:{type: Date,default: Date.now},
        image_caption: {type: String},
        image_credit: { type:String},
        imageTitle: {type: String},
        alt_text: {type: String},
        
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
        visual_arts_type: {type:Boolean},
        architecture_design_type: {type:Boolean},
        performance_design_type:{type:Boolean},
        lifestyle_design_type: {type:Boolean},
        fashion_design_type: {type:Boolean},
        travel_design_type: {type:Boolean},
        saveDrafts:{type:Boolean},
        Published:{type:Boolean},
        author_article: userSchema,
        artistData: artistsSchema,
        referencevenue:venuesSchema,
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
        recommendArticles: [{
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
        sliderUpload: [{
            enable_inq: {type:Boolean},
            imageCaption:{type:String},
            ImageCredit:{type:String},
            ImageTitle:{type:String},
            AltText:{type:String},
             _id:false
        }],
        globalarticleRegion: {type: String},
        GlobalRegion: {type: String},
        ReferenceVenue: {type:Boolean},
        ReferenceArtist: {type:Boolean}

   // }
});

var articleImageModel = mongoose.model('articleModel', articleSchema);

