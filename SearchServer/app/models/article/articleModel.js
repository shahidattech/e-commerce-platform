var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');

// var autherSchema = require(path.join(__dirname, '..', 'user', 'userModel'));
// var storySchema = require(path.join(__dirname, '..', 'story', 'storyModel'));
var imageSchema = require(path.join(__dirname,  'articleImageModel'));

var articleSchema = mongoose.Schema({
        title: {type: String},
        articleId: {type: String,default: shortid.generate},
        short_title: {type: String},
        summary: {type: String},
        tags: {type: String},
        categoryRadio: {type:String,},
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
        sub_channel: [{ Fairs: {type:Boolean},
            Auctions: {type:Boolean},
            Galleries: {type:Boolean},
            Museums: {type:Boolean},
            Columnist: {type:Boolean},
            Features: {type:Boolean},
             _id:false }],
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
        sub_subs: [{ News: {type:Boolean},
            Previews: {type:Boolean},
            Reviews: {type:Boolean},
            Parties: {type:Boolean},
            Videos: {type:Boolean},
             _id:false
        }],
        genu_res:[{ 'Contemporary Art': {type:Boolean},
              Masters: {type:Boolean},
              'Impressionism & Modern Art': {type:Boolean},
              Traditional: {type:Boolean},
              Antiquities: {type:Boolean},
               _id:false
               }],      
        files:[],

        author_article: [{
            author: {type: String},
         authorName:{type:String},
         authorTitle: {type:String},
         authorDescription: {type:String}
        }],
        artistData: [{
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

var articleModel = mongoose.model('articleModel', articleSchema);

