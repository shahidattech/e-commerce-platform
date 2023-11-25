var path = require('path');
var sliderModel = require('mongoose').model('sliderModel');
var check = require(path.join(__dirname, '..', '..',  'service', 'util', 'checkValidObject'));
var restify = require('restify');
var logger = require('logger').createLogger();

exports.createSlider = function (req, res, next) {
    let createSlider_resp = {};
    try {
        var sliderData = req.body;  
        var slider = formatSliderShowData(sliderData);
        console.log('sliderData', sliderData)
        sliderModel.findOneAndUpdate({_id: sliderData.userId}, 
            {$push:{"sliders" : slider}}, function(err, result){
                if(err){
                    console.log('Err=', err)
                    createSlider_resp.status = 500;
                    createSlider_resp.data = 'Failed to Add Slider, Pelase try later!'
                    res.send(createSlider_resp);
                }
                else{
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)){
                        result.save(function(err, result){
                            if(err){
                                console.log('err 24', err);
                                createSlider_resp.status = 500;
                                createSlider_resp.data = 'Failed to Add Slider, Pelase try later!'
                                res.send(createSlider_resp);
                            }
                            else{
                                sliderModel.findById({_id: sliderData.userId}, function(err, result){
                                    if(err){
                                        console.log('err 32', err);
                                        createSlider_resp.status = 500;
                                        createSlider_resp.data = 'Failed to Add Slider, Pelase try later!'
                                        res.send(createSlider_resp);
                                    }
                                    else{
                                        console.log('err 38', err);
                                        createSlider_resp.status = 200;
                                        createSlider_resp.data = result["sliders"].pop();
                                        res.send(createSlider_resp);
                                    }
                                });

                            }
                        });

                    }
                    else{
                        let sliderObj = new sliderModel();
                        let oneSlide = {
                            "createrId": slider.createrId,
                            "title": slider.title
                        };
                        sliderObj._id= slider.createrId;
                        sliderObj.sliders.push(oneSlide);
                        sliderObj.save(function(err, result){
                            if(err){
                                createSlider_resp.status = 500;
                                createSlider_resp.data = 'Failed to Add your first Slider, Pelase try later!'
                                res.send(createSlider_resp);
                            }
                            else{
                                createSlider_resp.status = 200;
                                createSlider_resp.data = result["sliders"].pop();
                                res.send(createSlider_resp);
                            }
                        });
                    }
                }
            });
        
    } catch (error) {
        createSlider_resp.status = 500;
        createSlider_resp.data = 'Failed to Add your first Slider, Pelase try later!'
        res.send(createSlider_resp);
    }
}


function formatSliderShowData(sliderData) {
    return {
        title: sliderData.title,
        createrId: sliderData.userId
    };
}

exports.listSlider = function (req, res, next) {
    let listSlider_resp = {};
    try {
        let pageNo = req.body.page;
        let options = {
            select: 'sliders._id sliders.title sliders.image',
            sort: { added_date: -1 },
            page: pageNo,
            limit: 30
        };
        sliderModel.paginate({_id: req.body.userId,  }, options, function (err, result) {
            if(err){
                console.log('err', err)
                listSlider_resp.status = 500;
                listSlider_resp.data = "Failed to fetch the result";
                res.send(listSlider_resp);
            }
            else{
                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result["docs"][0])){
                    listSlider_resp.status = 200;
                    listSlider_resp.data = result;
                    res.send(listSlider_resp);
                }
                else{
                    listSlider_resp.status = 204;
                    listSlider_resp.data = "You have No Sliders !";
                    res.send(listSlider_resp);
                }
            }
        });
    } catch (error) {
        console.log('err', error);
        listSlider_resp.status = 500;
        listSlider_resp.data = "Failed to fetch the result";
        res.send(listSlider_resp);
    }
}
  
exports.deleteSlider = function (req, res, next) {
    let deleteSlider_resp = {};
    try {
        var queryData = req.body;
        let createrId = queryData.userId;
        let sliderId = queryData.sliderId;
        console.log('createrId', createrId,sliderId)
        sliderModel.update({_id:createrId},
            {$pull: {"sliders" : {_id:sliderId}}}, function(err, result){
                if(err){
                    deleteSlider_resp.status = 500;
                    deleteSlider_resp.data = "Error while deleting the slider";
                    res.send(deleteSlider_resp);
                }
                else{
                    deleteSlider_resp.status = 200;
                    deleteSlider_resp.data = "Successsfully deleted";
                    res.send(deleteSlider_resp);
                }
            });
    } catch (error) {
        deleteSlider_resp.status = 500;
        deleteSlider_resp.data = "Failed to delete Slider";
        res.send(deleteSlider_resp);  
    }

}

