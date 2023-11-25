var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var path = require('path');
const shortid = require('shortid');
const mongoosePaginate = require('mongoose-paginate');

var homeConfigSchema = mongoose.Schema({
    userId: { type: String },
    sections: [],
    updated_date: { type: Date, default: Date.now }
});
homeConfigSchema.plugin(mongoosePaginate);

var homeConfigSchemaTheme2 = mongoose.Schema({
    userId: { type: String },
    sections: [],
    updated_date: { type: Date, default: Date.now }
});
homeConfigSchemaTheme2.plugin(mongoosePaginate);
var homeConfigModel = mongoose.model('homeConfig', homeConfigSchemaTheme2);
var homeConfigTheme2Model = mongoose.model('homeConfigTheme2', homeConfigSchemaTheme2);


var sliderSchema = mongoose.Schema({
    added_date: { type: Date, default: Date.now },
    createrId: { type: String },
    image: [],
    title: { type: String, required: true }
});
sliderSchema.plugin(mongoosePaginate);


var homeSliderModel = mongoose.model('sliderModel', sliderSchema);




