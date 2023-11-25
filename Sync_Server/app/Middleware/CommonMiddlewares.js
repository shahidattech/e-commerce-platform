const multer = require('multer');
var path = require('path');
 var storage = multer.diskStorage({
        destination: function (req, file, cb) { 
            cb(null,  __basedir + '/uploads/');
           
        },
        
    filename: function (req, file, cb) { 
        console.log("file in filename ",file);
        file.uploaded_name = Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
        var file_name=Date.now() + file.originalname.replace(/ /g, "_").toLowerCase();
        // if(file.fieldname && file.fieldname=="avatar"){
        //    file.avater_url = 'http://localhost:7001/'  + './public/images/uploads/' + file_name;
        // }
      
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);      
        cb(null, file_name);
        return
        },
        filename: function (req, file, callback) {
            callback(null,  file.fieldname + '-' + Date.now()  + path.extname(file.originalname));
        }
    }); 
    var upload = multer({
    "storage": storage,
    fileFilter: function (req, file, cb) {
        var ext=path.extname(file.originalname);
        console.log('ext', ext);
        if(file.fieldname && (file.fieldname=="upload_files" || file.fieldname=="uploadFiles" || file.fieldname=="feature_image" || file.fieldname=="paragraph_img" || file.fieldname=="sliderImg")){
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


module.exports = upload;