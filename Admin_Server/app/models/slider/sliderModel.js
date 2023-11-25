var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

var sliderSchema = mongoose.Schema({
    _id: { type: String },
    sliders: [{
        added_date: { type: Date, default: Date.now },
        createrId: { type: String },
        image: [],
        title: { type: String}
    }]
});

sliderSchema.plugin(mongoosePaginate);

var sliderModel = mongoose.model('sliderModel', sliderSchema);