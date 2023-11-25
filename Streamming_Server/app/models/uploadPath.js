var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageShcema = new Schema({
	
	//image:{type:String;}
	 portfolio_pic: {type: String}
});

var Image = mongoose.model('Image', ImageShcema);

module.exports = Image;