var homeConfigShowModel = require('mongoose').model('homeConfigTheme1');
var homeConfigTheme2ShowModel = require('mongoose').model('homeConfigTheme2');
// var mongoose = require('mongoose');
// var path = require('path');
// var jwt = require('../../service/auth/jwt')
// var featureChecker = require('../../service/auth/featureChecker');
var restify = require('restify');
// var db_data = require('../../data/db_data');

// var microSiteVenu = require(path.join(__dirname, '..', 'MicroSiteEntityProfileLocation', 'microSiteEntitylocationprofileBacisCtrl'));

exports.saveHomeConfig = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    // body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var homeConfigData = req.body;
    // var formattedArtclData = formatHomeConfigData(homeConfigData);
    // console.log('Creating HomeConfig Data with', formattedArtclData, '---------------------\n');

    var cursor = homeConfigShowModel;

    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    } else {
        // cursor.find({ userId: homeConfigData.userId }, function (err, th) {
        cursor.find({ _id: homeConfigData.userId }, function (err, th) {
            if (!err && th) {
                if (th.length == 0) {
                    createHomeconfig(homeConfigData, function (err, createHomeconfigData) {
                        res.status(200);
                        res.send({ 'status': 'success', 'data': createHomeconfigData });
                    });
                } else {
                    updateHomeconfig(homeConfigData, function (err, updateHomeconfigData) {
                        res.status(200);
                        res.send({ 'status': 'success', 'data': updateHomeconfigData });
                    });
                }
            } else {
                res.status(200);
                res.send({ 'status': 'error', 'error': err });
            }
        });
    }
};

function createHomeconfig(data, cb) {
    homeConfigShowModel.create(data, function (err, docs) {
        if (err) {
            console.log(err)
            return next(new restify.errors.InternalServerError(err));
        } else {
            cb(err, docs);
        }
    });
}

function updateHomeconfig(data, cb) {
    // homeConfigShowModel.findOneAndUpdate({ userId: data.userId }, data, function (err, docs) {
    homeConfigShowModel.findOneAndUpdate({ _id: data.userId }, data, function (err, docs) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            cb(err, docs);
        }
    });
}

// function formatHomeConfigData(homeConfigData) {
//     return {
//         userId: homeConfigData.userId,
//     };
// }

exports.getHomeConfigByUserId = function (req, res, next) {
    var homeConfigData = req.body;
    var cursor = homeConfigShowModel;
    
    let condition = {};
    if(homeConfigData.userId){
        condition['userId'] = homeConfigData.userId;
    }

    let options = {
        page: 1,
        limit: 30,
    }
    
    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    } else {
        cursor.paginate(condition, options, function (err, data) {
            if (err) {
                res.send(null);
            } else {
                if(data && data.docs.length > 0){
                    res.send(data.docs[0]);
                }else{
                    res.send(null);
                }
            }
        });
    }


}



//// theme 2
exports.saveHomeConfigTheme2 = function (req, res, next) {
    //  console.log(req.files.article_upload.name);
    body_json = JSON.stringify(req.body);

    // console.log(body_json);
    var homeConfigData = req.body;
    // var formattedArtclData = formatHomeConfigData(homeConfigData);
    // console.log('Creating HomeConfig Data with', formattedArtclData, '---------------------\n');

    var cursor = homeConfigTheme2ShowModel;

    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    } else {
        cursor.find({ userId: homeConfigData.userId }, function (err, th) {
            if (!err && th) {
                if (th.length == 0) {
                    createHomeconfigTheme2(homeConfigData, function (err, createHomeconfigTheme2Data) {
                        res.status(200);
                        res.send({ 'status': 'success', 'data': createHomeconfigTheme2Data });
                    });
                } else {
                    updateHomeconfigTheme2(homeConfigData, function (err, updateHomeconfigData) {
                        res.status(200);
                        res.send({ 'status': 'success', 'data': updateHomeconfigData });
                    });
                }
            } else {
                res.status(200);
                res.send({ 'status': 'error', 'error': err });
            }
        });
    }
};

function createHomeconfigTheme2(data, cb) {
    homeConfigTheme2ShowModel.create(data, function (err, docs) {
        if (err) {
            console.log(err)
            return next(new restify.errors.InternalServerError(err));
        } else {
            cb(err, docs);
        }
    });
}

function updateHomeconfigTheme2(data, cb) {
    homeConfigTheme2ShowModel.findOneAndUpdate({ userId: data.userId }, data, function (err, docs) {
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            cb(err, docs);
        }
    });
}

// function formatHomeConfigData(homeConfigData) {
//     return {
//         userId: homeConfigData.userId,
//     };
// }

exports.getHomeConfigTheme2ByUserId = function (req, res, next) {
    var homeConfigData = req.body;
    var cursor = homeConfigTheme2ShowModel;
    
    let condition = {};
    if(homeConfigData.userId){
        condition['userId'] = homeConfigData.userId;
    }

    let options = {
        page: 1,
        limit: 30,
    }
    
    if (!cursor) {
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    } else {
        cursor.paginate(condition, options, function (err, data) {
            if (err) {
                res.send(null);
            } else {
                if(data && data.docs.length > 0){
                    res.send(data.docs[0]);
                }else{
                    res.send(null);
                }
            }
        });
    }


}