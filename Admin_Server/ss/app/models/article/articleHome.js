var mongoose = require('mongoose');
var path = require('path');
var userSchema = require(path.join(__dirname, 'users', 'users'));
var homepageconfigSchema = mongoose.Schema({
    articleId: {type: String},
    slideshowId: {type: String},
    visual_arts_type:{type:Boolean},
    pos: {type: String},
    country_abb: {type: String},
    sliders: [{
        author: userSchema,
        country_abb: {type: String},
        image: [],
        sub_cat_label: {type: String},
        short_title: {type: String},
        summary: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
     }],
     features: [{
        author: userSchema,
        country_abb: {type: String},
        image: [],
        sub_cat_label: {type: String},
        short_title: {type: String},
        summary: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
     }],
    trending: [{
        author: userSchema,
        country_abb: {type: String},
        short_title: {type: String},
        image: [],
        sub_subs: {type: String},
        date_stamp: {type: String},
        pos: {type: String}
    }],
    topGlobalStories: [{
        articleId: {type: String},
        author: userSchema,
        country_abb: {type: String},
        short_title: {type: String},
        image: [],
        summary: {type: String},
        date_stamp: {type: String},
        region: {type: String},
        pos: {type: String}
    }],
    visual_arts: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
        visual_arts_type: {type:Boolean}
    }],
    architecture_design: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
        architecture_design_type: {type:Boolean}
    }],
    performance_arts: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
        performance_design_type: {type:Boolean}
    }],
    lifestyle_design: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
      lifestyle_design_type: {type:Boolean}
    }],
    fashion_design: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
      fashion_design_type: {type:Boolean}
    }],
      travel_design: [{
        title: {type: String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
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
      travel_design_type: {type:Boolean}
    }],


    popularSlideshows: [{
        country_abb: {type: String},
        title: {type: String},
        image: [],
        views:{type:Number,default:0},
        timestamp: {type:Date,default: Date.now    },
        pos: {type: String}
        
    }]            
    
});
var Token = mongoose.model('homepageconfig', homepageconfigSchema);