var restify = require('restify');
var sliderModel = require('mongoose').model('sliderModel');

exports.sliderPhoto = function (req, res, next) {
    let sliderPhoto_resp = {}; 
    var sliderData = req.body;
    console.log('sliderData', sliderData.userId, sliderData.slideId);
    var userId = sliderData.userId;
    var slideId = sliderData.slideId;

    if (!sliderModel)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    
    sliderModel.findOneAndUpdate({_id: userId, "sliders._id": slideId},
    {$set:{"sliders.$.image" : req.files['sliderImg'] ? req.files['sliderImg'] : null}},
    function(err, result){
        if(err){
            console.log('err', err);
            sliderPhoto_resp.status = 500;  
            sliderPhoto_resp.data = "Failed to update Slider Image";  
            res.send(sliderPhoto_resp);
        }
        else{
            sliderPhoto_resp.status = 200;  
            sliderPhoto_resp.data = "Sucessfully update slider image";  
            res.send(sliderPhoto_resp);
        }
    })
};