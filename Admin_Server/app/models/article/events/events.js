module.exports = [{
	title: {type: String},
    description_caption: {type: String},
    files:[],
    sub_channel: [{
      	'Art Fairs': {type:Boolean},
        'Gallery Shows': {type:Boolean},
        'Museum Exhibitions': {type:Boolean},
        'Auctions': {type:Boolean},
        'Talks': {type:Boolean},
             _id:false  
    }],
    PerformanceChannels: [{
      	'Theater & Dance': {type:Boolean},
        Film : {type:Boolean},
        Music : {type:Boolean},
        Opera : {type:Boolean},
        _id:false  
    }],
    LifesytlesChannels: [{
      	'Food & Wine': {type:Boolean},
        'Jewelry & Watches' : {type:Boolean},
        'Auto & Boats' : {type:Boolean},
        'Auctions' : {type:Boolean},
        'Fashion' : {type:Boolean},
        _id:false  
    }],
    ArchitectureChannels: [{
      	All: {type:Boolean},
        _id:false  
    }],
 	field_event_date: {type: String}
}]