var multer = require('multer');
var image_upload_url = constants.image_upload_url;
//var image_upload_url_icon = constants.image_upload_url_icon;
fs = require('fs');
path=require('path');
var jwt         = require('jwt-simple');
var security_key=require('../config/security_key');
var forEach = require('async-foreach').forEach;
var User = require('../models/user');
exports.uploadFiles = function (req, res, next) {
  try{        
        var storage = multer.diskStorage({
        destination: function (req, file, cb) { 
            cb(null, './uploads');
        },
        filename: function (req, file, cb) { 
            console.log("file in filename ",file);
            file.uploaded_name = Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
            var file_name=Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
            if(file.fieldname && file.fieldname=="avatar"){
               file.avater_url = constants.api_site_url + constants.image_folder + file_name;
            }
            if(file.fieldname && file.fieldname=="portfolio"){
               file.portfolio_url = constants.api_site_url + constants.image_folder + file_name;
            } 
            if(file.fieldname && file.fieldname=="files"){
               file.files_url = constants.api_site_url + constants.image_folder + file_name;
            }
            if(file.fieldname && file.fieldname=="cv"){
               file.cv_url = constants.api_site_url + constants.image_folder + file_name;
            }
            if(file.fieldname && file.fieldname=="certificates"){
               file.file_name=file_name; 
               file.certificates_url = constants.api_site_url + constants.image_folder + file_name;
            }
            if(file.fieldname && file.fieldname=="identity"){
               file.file_name=file_name; 
               file.identity_url = constants.api_site_url + constants.image_folder + file_name;
            }      
             console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);      
            cb(null, file_name);
            return
            }
            // filename: function (req, file, callback) {
            //     callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname + file.path);
            // }
        });
        var upload = multer({
            "storage": storage,
            fileFilter: function (req, file, cb) {
                var ext=path.extname(file.originalname);
                if(file.fieldname && (file.fieldname=="upload_files" || file.fieldname=="uploadFiles" || file.fieldname=="feature_image" || file.fieldname=="paragraph_img" || file.fieldname=="sliderImg" || file.fieldname=="avatar" || file.fieldname=="portfolio" || file.fieldname=="files")){
                    var validExtensions = ['.jpg','.png','.jpeg',".gif",".JPG",".PNG",".JPEG",".GIF"];
                    if (validExtensions.indexOf(ext) < 0) {
                      return cb(new Error('Allowed image extentions are jpg,png,jpeg and gif'))
                    }
                }
                if(file.fieldname && file.fieldname=="cv"){
                    var validExtensions = [".pdf", ".doc", ".docx"];
                    if (validExtensions.indexOf(ext) < 0) {
                      return cb(new Error('Allowed CV extentions are pdf,doc and docx'))
                    }
                }
                cb(null, true)
           }     
        });  
                
        return upload.fields([
            { name: 'avatar', maxCount: 1 }, 
            { name: 'portfolio', maxCount: 5 },
            { name: 'files', maxCount: 5 },
            { name: 'cv', maxCount: 1 },
            { name: 'certificates', maxCount: 100 },
            { name: 'identity', maxCount: 100 }
        ])(req, res, function (err){
            //return upload.any('avatar[]')(req, res, function (err){
            if (err) {
                res.send({status: false, message: 'Somethingh went wrong '+err,data:{}});
            }else{
                 //console.log("Middil uploadFiles",req.body);
              try{  
                    var avater="";
                    if(req.files && req.files.avatar && req.files.avatar!=""){
                      req.files.avatar.forEach(function (item) { 
                        avater= item.avater_url;
                      }) 
                      req.body.avater = avater; 
                    }                    
                    var portfolio=[];
                    if(req.files && req.files.portfolio && req.files.portfolio!=""){
                       req.files.portfolio.forEach(function (item) {
                         portfolio.push(item.portfolio_url);
                      }) 
                      req.body.portfolio = portfolio; 
                    }
                    var files=[];
                    if(req.files && req.files.files && req.files.files!=""){
                       req.files.files.forEach(function (item) {
                         files.push(item.files_url);
                      }) 
                      req.body.files = files; 
                    }
                    var cv="";
                    if(req.files && req.files.cv && req.files.cv!=""){
                      req.files.cv.forEach(function (item) {
                         cv=item.cv_url;
                      }) 
                      req.body.cv = cv; 
                    }
                    var certificates=[];var doc="";
                    if(req.files && req.files.certificates && req.files.certificates!=""){
                      req.files.certificates.forEach(function (item) {
                         doc={"type":"certificates","url":item.certificates_url,"name":item.file_name,"status":0} ;
                         certificates.push(doc);
                      }) 
                      req.body.certificates = certificates; 
                    }
                    var identity=[];var doc2="";
                    if(req.files && req.files.identity && req.files.identity!=""){
                      req.files.identity.forEach(function (item) {
                         doc2={"type":"identity","url":item.identity_url,"name":item.file_name,"status":0} ;
                         identity.push(doc2);
                      }) 
                      req.body.identity = identity; 
                    }
                    //console.log("ccccccccccccc ", req.files); // this is for get file data
                    next();
                }catch(err){
                   res.send({status: false, message: 'Somethingh went wrong '+err,data:{}});
              } 
            }
        }); 
        
     }catch(err){
        res.send({status: false, message: 'Somethingh went wrong '+err,data:{}});
    }
};

// exports.uploadFilesWithFs = function (req, res, next) {
//     var allFiles = composeFiles = [];
//     var messageFiles = [];
//     var feedbackFiles =[];
//     try{
//         if(req.body.files){
//             var files = req.body.files;
//         }
//         if(req.body.data.files){
//             var files = req.body.data.files;
//         }
//     }catch(err){
//         //console.log(err);
//     }
//     if(files) {
//         console.log("inside uploadFilesWithFs middleware function ");
//         forEach(files, function(item, index, arr) {            
//             var base64Data=item.file;
//             var file=Date.now() + item.name.replace(/ /g, "_").toLowerCase();
//              if(item.icon) {
//                 fs.writeFile(constants.image_upload_url_icon + file, base64Data, 'base64', function(err) {

//                 });
//             }else{
//                 fs.writeFile(constants.image_upload_url + file, base64Data, 'base64', function(err) {

//                 });
//             }

            

//             if(item.avatar_original) {
//                 req.body.avatar_original=constants.api_site_url+ constants.image_folder+file; 
//             }
//              if(item.icon) {
//                 req.body.icon=file; 
//             }

//             if(item.portfolio_pic) {
//                 allFiles.push(constants.api_site_url+ constants.image_folder+file);
//                 req.body.portfolio_pic=allFiles;
//             }


//             if(item.compose_files) {
//                 composeFiles.push(constants.api_site_url+ constants.image_folder+file);
//                 req.body.compose_files=composeFiles;
//             }

//             if(item.message_files) {
//                 messageFiles.push(constants.api_site_url+ constants.image_folder+file);
//                 req.body.message_files=messageFiles;
//             }

//             if(item.feedback_files) {
//                 feedbackFiles.push(constants.api_site_url+ constants.image_folder+file);
//                 req.body.feedback_files=feedbackFiles;
//             }

//             if(item.cv){
//                 req.body.cv=constants.api_site_url+ constants.image_folder+file; 
//             }

//         }, function(){
//             next();
//         });
//     }else{
//         next();
//     }
// };

exports.authenticateApi = function(req, res, next){
  next(); 
    // var token = getToken(req.headers);
    // if (token) {        
    //     try{
    //         var decoded = jwt.decode(token, security_key.secret);
    //         User.findOne({
    //             'basic_detail.email': decoded.user.email
    //         },{"_id":1,"is_activated":1,status:1,basic_detail:1,is_deactivated_from_admin:1}, function (err, user) {
    //             if (!user) {
    //                 return res.status(451).send({status: false, message: 'Invalid token'});
    //             } else {
    //                 if(user.is_deactivated_from_admin && user.is_deactivated_from_admin==1){
    //                    return res.status(451).send({status: false, message: 'Your account has been deactivated from admin.Please, contact to admin !'}); 
    //                 }else{                       
    //                    if(user.is_activated && user.is_activated==1){
    //                         if(user.basic_detail.user_type && user.basic_detail.user_type==2){
    //                             if(user.status==1){
    //                                 next(); 
    //                             }else{
    //                               //return res.status(403).send({status: false, message: 'Your account is pending, please complete your profile details for approval. Once approval has been granted, you will be able to use Bag a Builder.'});   
    //                               res.status(201);
    //                               next(); 
    //                             }
    //                         }else{
    //                            next(); 
    //                         }
    //                     }else{
    //                        return res.status(451).send({status: false, message: 'Your account is deactivated. Please, verify email and phone number first!'}); 
    //                    }
    //                 }
                    
    //             }
    //         });
    //     }catch(e){
    //         return res.status(451).send({status: false, message: 'Invalid token'}); 
    //     } 
    // } else {
    //     return res.status(451).send({status: false, message: 'No token provided.please pass valid token in header'});
    // }
}

/**
 * @author sachin
 * @param {type} headers
 * @returns {nm$_AuthController.getToken.parted}
 */
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}


