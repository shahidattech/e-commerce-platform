var path = require('path');
var tagsSchemas = require(path.join(__dirname, '..', 'tags', 'tagschema'));
var userSchema = require(path.join(__dirname, '..','users', 'users'));
var venuesSchema = require(path.join(__dirname, '..','venues', 'venues'));

module.exports = [{
 title: {type: String},
 summary: {type: String},
 added_date:{type: Date,default: Date.now},
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
   Auctions: {type:Boolean},
   _id:false
  }],
 LifesytlesSubs: [
  { News: {type:Boolean},
   Video: {type:Boolean},
   Parties: {type:Boolean},
   _id:false
  }],
 FashionChannels: [
  { 'Designer Spotlight': {type:Boolean},
   Runway: {type:Boolean},
   StyleGuide: {type:Boolean},
   Accessories: {type:Boolean},
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

 author_article: userSchema,
 
}]
