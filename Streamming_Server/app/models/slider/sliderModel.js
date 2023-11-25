var mongoose = require('mongoose');

var sliderSchema = mongoose.Schema({
    _id: { type: String },
    sliders: [{
        added_date: { type: Date, default: Date.now },
        createrId: { type: String },
        image: [],
        title: { type: String, required: true }
    }]
});


var sliderModel = mongoose.model('sliderModel', sliderSchema);