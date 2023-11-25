/* global __dirname */
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var User = mongoose.model('User');
// var Project = mongoose.model('Projects');
var fs = require('fs');
var path = require('path');
var Restify = require('restify');
var Joi = require('joi');
var async = require('async');
var check = require(path.join(__dirname, '..', '..', 'service', 'util', 'checkValidObject'));
var encrypt = require(path.join(__dirname, '..', '..', 'service', 'util', 'encryption'));
var userRoles = require('../../config/userRoles.json')

var defaultFeatureList = require(path.join(__dirname, '..', '..', 'data', 'userFeatureList')).defaultUserRoleFeatures;

// var il = require(path.join(__dirname, '..', '..', 'service', 'exception', 'internalLogger'));
// User.ensureIndex({ 'userName': "text", 'profile.firstName' : "text", 'profile.lastName' : "text" });


//Helper functions
function InitializeUser(data) {
    var randomSalt = encrypt.createSalt();
    var userData = {
       profile: {
            firstName: data.firstName,
            lastName: data.lastName
        },
        active: data.active,
        fullName:data.fullName,
        field_state: data.field_state,
        gender: data.gender,
        field_year_of_birth: data.field_year_of_birth,
        field_zip_code: data.field_zip_code,
        field_household_income: data.field_household_income,
        field_country: data.field_country,
        field_job_experience: data.field_job_experience,
        field_job_industry: data.field_job_industry,
        userName: data.userName,
        phoneNo: data.phoneNo,
        artinfo_url: data.artinfo_url,
        field_artinfo_newsletter: data.field_artinfo_newsletter,
        field_art_fair_reports: data.field_art_fair_reports,
        field_offer_lbm: data.field_offer_lbm,
        field_offer_lbf: data.field_offer_lbf,
        field_offer_artinfo: data.field_offer_artinfo,
        field_art_auction: data.field_art_auction,
        field_modern_painters: data.field_modern_painters,
        field_gallery_guide: data.field_gallery_guide,
        field_alerts: data.field_alerts,
        salt: randomSalt,
        hashedPwd: encrypt.hashPwd(randomSalt, data.passwd),
        userRole: data.userRole,
        personal_information: data.personal_information,
        recent_comments:data.recent_comments,
        Contact:data.Contact,
        language:data.language,
        timezone:data.timezone,
        block:data.block,
        mimemail_textonly:data.mimemail_textonly,
        field_address:data.field_address,
        field_city:data.field_city,
        field_phone:data.field_phone,
        field_more_microsites:data.field_more_microsites,
        field_terms_conditions:data.field_terms_conditions,
        field_user_company_profile:data.field_user_company_profile,
        group_audience:data.group_audience,
        field_profile_public:data.field_profile_public,
        field_position:data.field_position,
        //guide: data.guide,
        //features: defaultFeatureList,
        //messages: [],
        dateOfRegistration: new Date()
    };

    if (data.provider) {
        userData.scKey = data.scKey;
        userData.scHash = encrypt.hashPwd(randomSalt, data.uid + '_' + data.scKey);
        userData.scProvider = data.provider;
        //userData.active = data.active;
    }

    return userData;
}

// create new user
exports.createUser = function(req, res, next) {

    //get client data
    var userData = req.body;

    //initialize basic user
    var user = InitializeUser(userData);

    User.create(user, createUserCallback);
    function createUserCallback(err, base) {
        if (err) {
            return next(new Restify.errors.InternalServerError(err));
            console.log(err);
        }
        console.log(base);
        req.userId = base._id;
        res.status(200);
        res.send(true);
        next();
    }
};
exports.updateusers = function (req, res, next) {
  //  jwt.validateToken;
    //featureChecker.hasAccessToFeatureNew;
    var userData = req.body;
    console.log(req.files);
    var id = userData._id;
    // var sliderImg = userData.sliderImg;
    // var paragraph_img = userData.paragraph_img;
    console.log('Creating Article Data with', userData, '---------------------\n');
    if (!User)
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    // Verify Article Data----To be Done
    //articleUtil.verifyuserData(req, res, next, insertClassuserData);
    // var formatteduserData = formatuserData();
    // console.log(formatuserData);
    User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userData._id) }, { $push: { files: req.files } }).exec(function (err, th) {
        // console.log(insertedEvent);
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send('Users Created');
            next();
        }
    });
}

// check if user already exists 
exports.existsUser = function(req, res, next) {

    // check if user model undefined
    if (!User) {
        return next(new Restify
            .errors
            .InternalServerError('User model instance is not defined -- existing user check'));

    }

    // email validation
    Joi.validate({ userName: req.body.userName }, { userName: Joi.string().label('User name').email().max(100) }, isValidEmail);

    // callback for email validation check
    function isValidEmail(err, user) {
        // in case of invalid email, throw back error to the client
        if (err) {
            return next(new Restify.InvalidArgumentError('Invalid Email provided'));
        }

        // if email format seems ok, then proceeding to duplicate check
        checkIfEmailPreviouslyRegistered();
    }


    //function to check if email id has already been used to create an account earlier   
    function checkIfEmailPreviouslyRegistered() {
        // checking in database for users with the same email id as provided by user
        User.findOne({ userName: req.body.userName }).select(' _id active ').exec(function(err, userInfo) {
            if (err) {
                return next(new Restify.errors.InternalServerError(err));
            } else {

                if (check.isUndefinedOrNull(userInfo)) {
                    return next();
                }

                // if more than zero documents match the email id that the user provided
                // then throw error back to user saying that email already used   
                if (userInfo.active) {
                    return next(new Restify.errors.ForbiddenError({
                        message: {
                            text: 'Email Id already registered',
                            field: 'userName',
                            metadata: req.body,
                            userId: req.userId
                        }
                    }));
                } else {
                    return next(new Restify.errors.ForbiddenError({
                        message: {
                            text: 'User Account is not activated',
                            field: 'userName',
                            extra: { isDuplicate: true },
                            metadata: req.body,
                            userId: req.userId
                        }
                    }));
                }
            }
        });
    }
};







// check if user already exists 
exports.getUsers = function(req, res, next) {


    // check if user model undefined
    if (!User || !Project) {
        return next(new Restify
            .errors
            .InternalServerError('User and Project model instance is not defined -- existing user check'));
    }


    var query = {};

    if(req.params.searchText){
        var regex = new RegExp(req.params.searchText);
        query = {
            $or: [
                {'userName': regex},
                {'profile.firstName': regex},
                {'profile.lastName': regex}
            ]
        };
    };


    User
        .find(query)
        .limit(10)
        .select('_id userName profile')
        .lean()
        .exec(function(err, data){
            res.status(200);
            res.send(data);
            next();
        });
};







// exports.checkDuplicateUser = function(req, res, next) {
//     // checking in database for users with the same email id as provided by user
//     User.findOne({ userName: req.body.userName }).select(' _id active ').exec(function(err, userInfo) {
//         if (err) {
//             return next(new Restify.errors.InternalServerError(err));
//         } else {
//             if (check.isUndefinedOrNull(userInfo)) {
//                 next();
//             } else {
//                 return next(new Restify.errors.ForbiddenError({
//                     message: {
//                         text: 'Email Id already registered',
//                         field: 'userName',
//                         metadata: req.body
//                     }
//                 }));
//             }
//         }
//     });
// }

// exports.getAllUsers = function (req, res, next) {
//     User.find({}).select('-salt -hashedPwd').exec(function (err, collection) {
//         if (err) {
//             return next(new Restify.errors.InternalServerError(err));
//         }
//         else {
//             res.status(200);
//             res.send(collection);
//             next();
//         }
//     });
// }

// exports.getUser = function (req, res, next) {
//     User.findById(req.params.id).select('-salt -hashedPwd').exec(function (err, document) {
//         if (err) {
//             return next(new Restify.errors.InternalServerError(err));
//         } else {
//             res.status(200);
//             res.send(document);
//             next();
//         }
//     });
// }

exports.updateUserPassword = function(req, res, next) {
    var randomSalt = encrypt.createSalt();

    function checkPassword(incomingPassword, user) {
        return encrypt.hashPwd(user.salt, incomingPassword) === user.hashedPwd;
    }



    User.findById(req.userId, 'salt hashedPwd', getUserSaltAndPasswdCallback);

    function getUserSaltAndPasswdCallback(err, user) {
        if (err) {
            return next(new Restify.errors.InternalServerError(err));
        } else {

            if (!user || !checkPassword(req.body.passwdold, user)) {
                return next(new Restify.errors.InvalidArgumentError('Incorrect Password'));
            }
            User.findByIdAndUpdate(req.userId, {
                    salt: randomSalt,
                    hashedPwd: encrypt.hashPwd(randomSalt, req.body.passwdnew)
                }, {
                    upsert: true,
                })
                .exec(function(err, document) {
                    if (err) {
                        return next(new Restify.errors.InternalServerError(err));
                    } else {
                        res.status(200);
                        res.send(true);
                        next();
                    }
                });
        }
    }
};

exports.updateAvatar = function(req, res, next) {
    var updateQuery = {};

    if (req.body.isCoverImg) {
        updateQuery = {
            'profile.coverName': req.body.coverName,
            'profile.coverVerticalOffset': req.body.coverVerticalOffset
        }
    } else {
        updateQuery = {
            'profile.pictureName': req.body.pictureName
        };
    }

    async.parallel({
        updateUserModel: function(callback) {
            setTimeout(function() {
                updateUserProfileImg(callback);
            }, 200);
        },
        updatePersonModel: function(callback) {
            setTimeout(function() {
                updatePersonProfileImg(callback);
            }, 200);
        }
    }, function(err, results) {
        if (err) {
            return next(new Restify.errors.InternalServerError(err));
        }
        res.status(200);
        res.send(true);
        next();
    });

    function updateUserProfileImg(callback) {
        User.findByIdAndUpdate(req.userId, updateQuery)
            .exec(function(err, user) {
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
    }

    function updatePersonProfileImg(callback) {
        var personModel = req.userRole == 'teacher' ? Teacher : Student;

        personModel.findByIdAndUpdate(req.userId, updateQuery).exec(function(err, teacher) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    }
};
exports.userUpdate = function (req, res,next) {
    User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
        console.log(err, user);
        if (err) {
             return next(new Restify.errors.InternalServerError(err));
         }
        res.status(200);
        res.send('User updated');
         next();
    });
};  
exports.updateUserProfile = function(req, res, next) {
    var updateQuery = _.mapKeys(req.body, function(value, key) { return 'profile.' + key; });
    console.log(req.userId);
    User.findByIdAndUpdate(req.userId, updateQuery)
        .exec(function(err, user) {
            console.log(err, user);
            if (err) {
                return next(new Restify.errors.InternalServerError(err));
            }
            res.status(200);
            res.send(true);
            next();
        });
}


exports.updateUserLoginActivity = function(req, res, next) {
    var updateQuery = {
        'activity.lastLogin': new Date().toISOString()
    };

    var personModel = req.userRole == 'teacher' ? Teacher : Student;

    personModel.findByIdAndUpdate(req.userId, updateQuery).exec(function(err, teacher) {
        if (err) {
            il.logInternalExcep('Error in login activity update',
                'userCtrl.updateUserLoginActivity', { reqBody: req.body, userId: req.userId });
        }

        next();
    });
}

// exports.updateAccActivationActivity = function(req, res, next) {
//     var updateQuery = {
//         'activity.dateOfActivation': new Date().toISOString()
//     };

//     var personModel = req.userRole == 'teacher' ? Teacher : Student;

//     personModel.findByIdAndUpdate(req.userId, updateQuery).exec(function(err, teacher) {
//         if (err) {
//             il.logInternalExcep('Error in login activity update',
//                 'userCtrl.updateUserLoginActivity', { reqBody: req.body, userId: req.userId });
//         }

//         next();
//     });
// }

// exports.getUserProfile = function (req, res, next) {

//     //Check model instance
//     if (!User)
//         return next(
//             new Restify
//                 .errors
//                 .InternalServerError('User model is not defined.'));

//     User.find({ _id: new ObjectId(req.params.id) })
//         .select(' profile userName userRole ')
//         .lean()
//         .exec(getCallback);

//     function getCallback(err, user) {
//         if (err)
//             return next(new Restify.errors.InternalServerError(err));
//         else if (!user)
//             return next(new Restify.errors.NotFoundError({
//                 message: 'User not found',
//                 metadata: req.params.id
//             }));
//         else {
//             res.status(200);
//             res.send(user);
//             next();
//         }
//     }
// }






exports.getProfileInfo = function(req, res, next) {
    User.findOne(req.query.id, function(err, data) {
            if (err) {
                res.json(err);
               return next(new Restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
  
};
exports.getalldetails = function(req, res,next) {
      return res.status(200).json(decodedToken.firstName);
}

exports.getUsersByIds = function(req, res, next) {

    if (!req.body.userIds) {
        return next(new restify.InvalidArgumentError('Invalid user id'));
    }

    // map all with objectid

    var arryOfObjIds = _.map(req.body.userIds, function(i){
        return new ObjectId(i);
    });

    User.find({
        _id: {
            $in: arryOfObjIds
        }
    }).select(' profile userName ')
        .exec(function(err, data) {
            if (err) {
                return next(new Restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(data);
            }
        });
};

exports.getAllUsersExceptOneById = function(req, res, next) {
    
    if (!req.params.id) {
        return next(new restify.InvalidArgumentError('Invalid user id'));
    }
    User.find({
        _id: {
            $ne: req.params.id
        }
    }).select('_id userName profile')
    .lean()
    .exec(function(err, data){
        res.status(200);
        res.send(data);
        next();
    });
};
    
// This function gets the details of Articles
exports.userallDetails = function (req, res, next){
    var cursor = User;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({},function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(objs);
            }
        });
    }    
}

exports.getUserRoles = (req,res,next)=>{
    res.send(userRoles.userRoles)
}