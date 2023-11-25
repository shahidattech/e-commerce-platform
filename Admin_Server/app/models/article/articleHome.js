var mongoose = require('mongoose');
var path = require('path');
var userSchema = require(path.join(__dirname, 'users', 'users'));
var homepageconfigSchema = mongoose.Schema({
    // articleId: {type: String},
    article_page: {type:String},
    slideshowId: {type: String},
    slideshow_page: {type:String},
    category_type_article:{type:String},
    // pos: {type: String},
    country_abb: {type: String},
    sliders: [{
        articleId: {type: String},
        author: userSchema,
        country_abb: {type: String},
        image: [],
      title:{type:String},
      category_type_article: {type:String},
      sub_cat_label:{type:String},
        short_title: {type: String},
        summary: {type: String},
       added_date: {type:Date,default: Date.now },
        pos: {type: String}
     }],
     features: [{
        articleId: {type: String},
        author: userSchema,
        country_abb: {type: String},
        image: [],
        category_type_article: {type:String},
       title:{type:String},
        sub_cat_label: {type: String},
       sub_cat_label:{type:String},
        short_title: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
        pos: {type: String}
     }],
    trending: [{
        articleId: {type: String},
        author: userSchema,
        country_abb: {type: String},
        category_type_article: {type:String},
        short_title: {type: String},
      title:{type:String},
      sub_cat_label:{type:String},
        image: [],
        added_date: {type:Date,default: Date.now },
        pos: {type: String}
    }],
    topGlobalStories: [{
        articleId: {type: String},
        author: userSchema,
        country_abb: {type: String},
        short_title: {type: String},
        category_type_article: {type:String},
      title:{type:String},
      sub_cat_label:{type:String},
        image: [],
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
        region: {type: String},
        pos: {type: String}
    }],
    visual_arts: [{
        title: {type: String},
        short_title: {type: String},
        image: [],
        author_article: userSchema,
        articleId: {type: String},
        summary: {type: String},
        category_type_article: {type:String},
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
      genu_res:[{ 'Contemporary Art': {type:Boolean},
        'Old Masters & Renaissance': {type:Boolean},
        'Impressionism & Modern Art': {type:Boolean},
        Traditional: {type:Boolean},
        Antiquities: {type:Boolean},
        _id:false
      }],
        visual_arts_type: {type:Boolean}
    }],
    architecture_design: [{
        title: {type: String},
        image: [],
         short_title: {type: String},
         category_type_article: {type:String},
        articleId: {type: String},
        author_article: userSchema,
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
         short_title: {type: String},
         category_type_article: {type:String},
        author_article: userSchema,
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
          author_article: userSchema,
          Video: {type:Boolean},
          Parties: {type:Boolean},
           _id:false  
      }],
        performance_design_type: {type:Boolean}
    }],
    Books: [{
        title: {type: String},
         short_title: {type: String},
        author_article: userSchema,
        category_type_article: {type:String},
        image: [],
        articleId: {type: String},
        summary: {type: String},
        added_date: {type:Date,default: Date.now },
        
    }],
    lifestyle_design: [{
        title: {type: String},
        image: [],
         short_title: {type: String},
        articleId: {type: String},
        author_article: userSchema,
        summary: {type: String},
        category_type_article: {type:String},
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
         short_title: {type: String},
        articleId: {type: String},
        author_article: userSchema,
        summary: {type: String},
        category_type_article: {type:String},
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
         short_title: {type: String},
        articleId: {type: String},
        summary: {type: String},
        category_type_article: {type:String},
        author_article: userSchema,
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
         short_title: {type: String},
         category_type_article: {type:String},
        image: [],
        views:{type:Number,default:0},
        timestamp: {type:Date,default: Date.now    },
        pos: {type: String}
        
    }],
    current_date:[{
      country_abb: {type: String},
      short_title: {type: String},
      category_type_article: {type:String},
      title: {type: String},
      image: [],
       short_title: {type: String},
      views:{type:Number,default:0},
      articleId: {type:String}
    }],
    current_week:[{
      country_abb: {type: String},
      short_title: {type: String},
      category_type_article: {type:String},
      title: {type: String},
      image: [],
       short_title: {type: String},
      views:{type:Number,default:0},
      articleId: {type:String}
    }],
    current_month:[{
      country_abb: {type: String},
      short_title: {type: String},
      category_type_article: {type:String},
      title: {type: String},
      image: [],
       short_title: {type: String},
      views:{type:Number,default:0},
      articleId: {type:String}
    }],
    all_time_most_popular:[{
      country_abb: {type: String},
      short_title: {type: String},
      category_type_article: {type:String},
      title: {type: String},
      image: [],
       short_title: {type: String},
      views:{type:Number,default:0},
      articleId: {type:String}
    }],

    // popular slideshow
     current_date_slideshow: [{
        image: [],
        title:{type:String},
         short_title: {type: String},
        slideshowId: {type:String},
        category_type_article:{type:String},
        views:{type:Number,default:0},
        ArchitectureChannels: [{ Architecture: {type:Boolean},
            Design: {type:Boolean},
            'Home & Interiors': {type:Boolean},
             _id:false  
        }],
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
    }],

    month_date_slideshow: [{
        image: [],
        title:{type:String},
         short_title: {type: String},
          category_type_article:{type:String},
        slideshowId: {type:String},
        views:{type:Number,default:0},
        ArchitectureChannels: [{ Architecture: {type:Boolean},
            Design: {type:Boolean},
            'Home & Interiors': {type:Boolean},
             _id:false  
        }],
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
    }],
    all_time_slideshow: [{
        image: [],
        title:{type:String},
        category_type_article:{type:String},
        slideshowId: {type:String},
         short_title: {type: String},
        views:{type:Number,default:0},
        ArchitectureChannels: [{ Architecture: {type:Boolean},
            Design: {type:Boolean},
            'Home & Interiors': {type:Boolean},
             _id:false  
        }],
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
    }],
     week_date_slideshow: [{
        image: [],
        title:{type:String},
         category_type_article:{type:String},
        slideshowId: {type:String},
        views:{type:Number,default:0},
        ArchitectureChannels: [{ Architecture: {type:Boolean},
            Design: {type:Boolean},
            'Home & Interiors': {type:Boolean},
             _id:false  
        }],
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
    }]                                             
    
});
var homepageconfig = mongoose.model('homepageconfig', homepageconfigSchema);
