var slideShowModel = require('mongoose').model('slideShowModel');
var mongoose = require('mongoose');
var path = require('path');
var jwt = require('../../service/auth/jwt')
var featureChecker = require('../../service/auth/featureChecker');
var restify = require('restify');
var db_data = require('../../data/db_data');
var check = require(path.join(__dirname, '..', '..', 'service', 'util', 'checkValidObject'));

exports.createSlideShow = function (req, res, next) {
    let createSlideShow_resp = {};
    try {
        var slideShowData = req.body;
        var formattedSlideshowData = formatSlideShowData(slideShowData);
        console.log('formattedArtclData', formattedSlideshowData);
        slideShowModel.findByIdAndUpdate({_id:  formattedSlideshowData.userId},
            {$push:{slideShows: formattedSlideshowData}}, function(err, result){
                if(err){
                    createSlideShow_resp.status = 500;
                    createSlideShow_resp.data = "Failed to create the new slideshow";
                    res.send(createSlideShow_resp);    
                }
                else{
                    if(!check.isUndefinedOrNullOrEmptyOrNoLen(result)) {
                        result.save(function(err, result){
                            if(err){
                                createSlideShow_resp.status = 500;
                                createSlideShow_resp.data = "Failed to append the Slideshow" ;
                                res.send(createSlideShow_resp);
                            }
                            else{
                                slideShowModel.findById({_id: formattedSlideshowData.userId},
                                    function(err, result){
                                        if(err){
                                            createSlideShow_resp.status = 500;
                                            createSlideShow_resp.data = "Failed to append the Slideshow" ;
                                            res.send(createSlideShow_resp);
                                        }
                                        else{
                                            createSlideShow_resp.status = 200;
                                            createSlideShow_resp.data = result.slideShows.pop()._id;
                                            res.send(createSlideShow_resp);
                                        }
                                    });

                            }
                        });
                    }
                    else{
                        let slideShowObj = new slideShowModel();
                        slideShowObj._id = formattedSlideshowData.userId;
                        slideShowObj.slideShows.push(formattedSlideshowData);
                        slideShowObj.save(function(err, result){
                            if(err){
                                createSlideShow_resp.status = 500;
                                createSlideShow_resp.data = "Failed to create the new slideshow";
                                res.send(createSlideShow_resp);
                            }
                            else{
                                createSlideShow_resp.status = 200;
                                createSlideShow_resp.data = result.slideShows.pop()._id;
                                res.send(createSlideShow_resp);
                                res.send(createSlideShow_resp);
                            }
                        });
                    }
                }
            });
            
    } catch (error) {
        createSlideShow_resp.status = 500;
        createSlideShow_resp.data = "Failed to create the new slideshow";
        res.send(createSlideShow_resp);
    }
}

exports.listSlideShow = function (req, res, next) {
    let listSlideShow_resp = {};
    try {
        let pageNo = req.body.page;
        let options = {
            select: 'slideShows._id slideShows.title slideShows.added_date slideShows.shortTitle slideShows.slides',
            sort: { added_date: -1 },
            page: pageNo,
            limit: 30
        };
        slideShowModel.paginate({_id: req.body.userId,  }, options, function (err, result) {
            if(err){
                console.log('err', err)
                listSlideShow_resp.status = 500;
                listSlideShow_resp.data = "Failed to fetch the result";
                res.send(listSlideShow_resp);
            }
            else{
                if(!check.isUndefinedOrNullOrEmptyOrNoLen(result["docs"][0])){
                    listSlideShow_resp.status = 200;
                    listSlideShow_resp.data = result;
                    res.send(listSlideShow_resp);
                }
                else{
                    listSlideShow_resp.status = 204;
                    listSlideShow_resp.data = "You have No slideshow !";
                    res.send(listSlideShow_resp);
                }
            }
        });
    } catch (error) {
        console.log('err', error);
        listSlideShow_resp.status = 500;
        listSlideShow_resp.data = "Failed to fetch the result";
        res.send(listSlideShow_resp);
    }
}
   
exports.deleteSlideShow = function (req, res, next) {
    var queryData = req.body;
    let condition = {};
    if (queryData.userId) {
        condition['createrId'] = queryData.userId;
    }
    let userId = queryData.userId;
    let slideShowId = queryData.slideShowId;
    console.log( 'slideShowId', slideShowId);

    slideShowModel.remove({ _id: userId, 'slideShows._id':slideShowId  }, (err, object) => {
        if (err) {
            res.send({ status: 'failure', response: err });
        } else {
            res.send({ status: 'success' });
        }
    });
};

function formatSlideShowData(slideShowData) {
    return {
        title: slideShowData.title,
        userId: slideShowData.userId,
        shortTitle: slideShowData.shortTitle,
        description: slideShowData.description,
    };
}

