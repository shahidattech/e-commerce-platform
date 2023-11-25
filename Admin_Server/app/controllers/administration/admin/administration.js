var restify = require('restify');
var administrationModel = require('mongoose').model('administrationModel');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');

exports.administrationUsers = function (req, res, next) {
  jwt.validateToken;
  featureChecker.hasAccessToFeatureNew;

    var administrationData = req.body;

    console.log('Creating Artist Data with', administrationData);

    var administrationDatas = new administrationModel({

        active: administrationData.active,
        role: administrationData.role,
        userId: administrationData.userId
       
      });

    administrationDatas.save(function(err){
      if(err) console.log('dd' + err); 
    });
    //log applicationForm
   console.log(JSON.stringify(administrationDatas, null, 30));
    
    res.send(administrationDatas);

}


// // This function gets the details of Articles
// exports.getArticle = function (req, res, next){
//     var cursor = artistModel;
//     if (!cursor){
//         return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
//     }
//     else{
//         cursor.find(function(err, objs){
//             if (err) {
//                 return next(new restify.errors.InternalServerError(err));
//             } else {
//                 res.status(200);
//                 res.send(objs);
//             }
//         });
//     }    
// }
