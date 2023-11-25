/* global __dirname */
var userModel = require('mongoose').model('User');
var ObjectId = require('mongoose').Types.ObjectId;//Import ObjectId type of mongo
var _ = require('lodash');
var restify = require('restify');
var path = require('path');
var exceptionHandler = require(path.join(__dirname, '..', 'util', 'exceptionHandler'));
var rf = require(path.join(__dirname, '..', '..', 'data', 'routesFeatures'));

//TODO: use the other function
exports.hasAccessToFeature = function (req, res, userId, feature, next) {
    checkFeature(req, res, feature, next);
};

exports.hasAccessToFeatureNew = function (req, res, next) {
    var feature = rf.getRouteFeature(req);
    checkUserRole(req.userId, feature,(err,data)=>{
        if (err)
            return next(new restify.InvalidArgumentError(err));

        next();
    });
};

var checkFeature = function (req, res, feature, next) {
    if (!feature) {
        return;
    }

    userModel
        .findOne({ _id: new ObjectId(req.userId) })
        .select(' features userRole ')
        .exec(function (err, userInfo) {
            if (err || !userInfo) {
                exceptionHandler
                    .internal(req, res, typeof err != 'undefined' ? [err] : ['No access features found.']);
            }
            else {
                var savedFeature = _.find(userInfo.features, function (f) {
                    return f.feature == feature;
                });
                if (savedFeature && savedFeature.hasAccess) {
                    next();
                }
                else {
                    exceptionHandler
                        .invalidParam(res, [feature + ' is not available for this role.']);
                }
            }
        });
};

var checkUserRole = (userId,Role,callback)=>{
    console.log(userId);
    userModel.findOne({_id: userId},{userRole:1,_id:0}).lean(true).exec((err,data)=>{
        if(err){
            //console.log('err',err)
            callback(err,null);
        }else{
            let permission = false;
            for(let i=0 ; i < Role.length; i++ ){
                //console.log('data1',data.userRole.split(',')[i])
                if(data.userRole.toLowerCase() == Role[i].toLowerCase()){
                    permission = true;
                }
            }
            if(permission){
                callback(null,"Access");
            }else{
                callback("You dont Have Access to do this action",null);
            }
   
        }
    })

}
