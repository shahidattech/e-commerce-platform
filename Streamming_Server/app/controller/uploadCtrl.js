/* global process */
/* global __dirname */
var multer = require('multer');

//var mongoose = require('mongoose');
var Image = require('./../models/uploadPath');
var fs = require('fs');
var path = require('path');
var forEach = require('async-foreach').forEach;
var sit_url = 'http://localhost:2001/api/' + 'uploads/';
// var url = require('url');
// const DIR = './uploads';

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, DIR);
//     },
//      filename: function (req, file, cb) { 
//         console.log("file in filename ",file);
//         file.uploaded_name = Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
//         var file_name=Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
//         if(file.fieldname && file.fieldname=="portfolio_pic"){
//            file.portfolio_url = constants.api_site_url + constants.image_folder + file_name;
//         }
//         // if(file.fieldname && file.fieldname=="portfolio"){
//         //    file.portfolio_url = constants.api_site_url + constants.image_folder + file_name;
//         // }
//     }, 
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
//     }
// });
// let upload = multer({storage: storage}).array('portfolio_pic',12);


exports.uploadClassVideo = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.files) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files.file)) {

        return next('Required parameter is missing');
    }
    var file = req.files.file;

    if (file && file.size > config.MAX_VIDEO_FILE_SIZE) {
        return next('File size is over the limit');
    }
    pathGen.genClassResPath(file.name, req.userId, true, 'videos', function(err, data) {
        if (err) {
            return next(err);
        }
        req.filePath = data.filePath;
        req.fileName = data.newFileName;
        req.file = file;
        req.isPublicStorage = false;
        fileHandlerMgr.uploadFile(req, res, next);
    });
};

exports.uploadClassNote = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.files) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files.file)) {
        return next('Required parameter is missing');
    }
    var file = req.files.file;
    if (file && file.size > config.MAX_NOTE_FILE_SIZE) {
        return next('File size is over the limit');
    }
    pathGen.genClassResPath(file.name, req.userId, false, 'notes', function(err, data) {
        if (err) {
            return next(err);
        }

        req.filePath = data.filePath;
        req.fileName = data.newFileName;
        req.file = file;
        req.isPublicStorage = false;

        fileHandlerMgr.uploadFile(req, res, next);
    });
};

exports.uploadAsset = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.files) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files.file)) {
        return next('Required parameter is missing');
    }

    var file = req.files.file;

    if (file && file.size > config.MAX_NOTE_FILE_SIZE) {
        return next('File size is over the limit');
    }

    pathGen.getAssetPath(req.userId, file.name,
        function(err, data) {
            if (err) {
                return next(err);
            }

            req.filePath = data.filePath;
            req.fileName = data.newFileName;
            req.file = file;
            req.isPublicStorage = false;

            fileHandlerMgr.uploadAssetFile(req, res, next);
        });
}

exports.uploadTestAttachments = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.testId) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files.file)) {
        return next('Missing required parameters');
    }

    var file = req.files.file;

    if (file && file.size > config.MAX_TEST_ATTCH_FILE_SIZE) {
        return next('File size is over the limit');
    }

    pathGen.genTestAttachPath(file.name, req.userId, 'tests', req.body.testId, function(err, data) {
        if (err) {
            return next(err);
        }

        req.filePath = data.filePath;
        req.fileName = data.newFileName;
        req.file = file;
        req.isPublicStorage = false;

        fileHandlerMgr.uploadFile(req, res, next);
    });
};

exports.uploadMessageAttmt = function(req, res, next) {
    if (ck.isUndefinedOrNullOrEmptyOrNoLen(req.body.msgId) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files) ||
        ck.isUndefinedOrNullOrEmptyOrNoLen(req.files.file)) {
        return next('Missing required parameters');
    }

    var file = req.files.file;

    if (file && file.size > config.MAX_MSG_FILE_SIZE) {
        return next('File size is over the limit');
    }

    pathGen.genMessageAttachPath(req.body.msgId, req.body.orderNo, function(err, data) {
        if (err) {
            return next(err);
        }

        req.filePath = data.filePath;
        req.fileName = file.name;
        req.file = file;
        req.isPublicStorage = false;

        fileHandlerMgr.uploadFile(req, res, next);
    });
};



exports.uploadProfilePicture = function(req, res, next) {

     //  upload(req, res, function(err) {
     //     if (err) {
     //         return res.end("Something went wrong!");
     //     }
     //     // var portfolio_pic=[];
     //     //    if(req.files && req.files.portfolio_pic && req.files.portfolio_pic!=""){
     //     //       req.files.portfolio_pic.forEach(function (item) {
     //     //        portfolio_pic.push(item.portfolio_url);
     //     //      }) 
     //     //      req.body.portfolio_pic = portfolio_pic; 
     //     //    }
     //     //  res.send(req.files);
     //     console.log(req.files);
     //     return res.end("File uploaded sucessfully!.");

     // });

    //  upload(req, res, (err) => {
    //     if (err) {
    //         return res.end('error request file');
    //     }
    //     var data = new Image({
    //       //  text: req.body.text,
    //         image: req.files.originalname
    //     });
    //     data.save().then((result) => {
    //         res.end(result);
    //     });
    //     console.log(req.files);
    //     res.end('upload file success');
    //     console.log('success');
       
    // });

    try{        
        var storage = multer.diskStorage({
        destination: function (req, file, cb) { 
            // cb(null, './uploads/');
            cb(null, '.bucketname/article/artiCleID');
        },
        filename: function (req, file, cb) { 
            console.log("file in filename ",file);
            file.uploaded_name = Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
            var file_name=Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
            if(file.fieldname && file.fieldname=="portfolio_pic"){
              file.portfolio_url = 'http://localhost:2001/api/' + 'uploads/' + file_name;
               console.log(file.portfolio_url);
            }
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);      
            cb(null, file_name);
            return
            },
            filename: function (req, file, cb) {
                cb(null,  file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
           // console.log(req.files);
            }

        });
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, cb) {
                var ext=path.extname(file.originalname);
                if(file.fieldname && (file.fieldname=="portfolio_pic" || file.fieldname=="portfolio" || file.fieldname=="files")){
                    var validExtensions = ['.jpg','.png','.jpeg',".gif",".JPG",".PNG",".JPEG",".GIF"];
                    if (validExtensions.indexOf(ext) < 0) {
                      return cb(new Error('Allowed image extentions are jpg,png,jpeg and gif'))
                    }
                }
              
                cb(null, true)
           }     
        });     
        return upload.fields([
           { name: 'portfolio_pic', maxCount: 5 }
        ])
        
        (req, res, function (err){
            // console.log(req.files);
           // return upload.any('portfolio_pic')(req, res, function (err){
            if (err) {
                res.send({status: false, message: 'Somethingh went wrong '+err,data:{}});
            }else{
                 console.log("Middil uploadFiles",req.body);
              try{  
                    var portfolio_pic=[];
                    if(req.files && req.files.portfolio_pic && req.files.portfolio_pic!=""){
                        res.send(req.files);
                    //    req.files.portfolio_pic.forEach(function (item) {
                    //     //    console.log(item)
                    //      portfolio_pic.push(item.sit_url+file_name);
                    //      // portfolio_pic= item.sit_url;
                    //      console.log(' ss ' + (req.files));
                    //   }) 
                    //   req.body.portfolio_pic = portfolio_pic; 
                    //    console.log("ccccccccccccc ", req.files);
                    }
                    // this is for get file data
                    next();
                }catch(err){
                   res.send({status: false, message: 'Somethinghdd went wrong '+err,data:{}});
              } 
            }
      // });
        }); 
        
     }catch(err){
        res.send({status: false, message: 'Somethingh went wrong '+err,data:{}});
    }
 


};
