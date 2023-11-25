var restify = require('restify');
var TagModel = require('mongoose').model('tagModel');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');

exports.getTag=(req, res, next)=>{
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;

    var cursor = TagModel;
    if (!cursor){
        return next(new restify.errors.InternalServerError('Model instance(s) is not defined'));
    }
    else{
        cursor.find(function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send(objs);
            }
        });
    }    
}

exports.addTag = (req,res,next)=>{
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var tagData = req.body;
    console.log('test',tagData);
    var cursor = TagModel;
    cursor.find({tagName: tagData.tag},(err, result)=>{
        if(result.length){
            console.log('Tag already present',tagData);
            res.send({'message':'already Exits'})
        }else{
            console.log('Creating Tag', tagData);
            var tagDatas = new TagModel({

                tagName:tagData.tag,
                authorName:tagData.author,

                });

            tagDatas.save(function(err){
                if(err) console.log('dd' + err); 
            });
            //log applicationForm
            console.log(JSON.stringify(tagDatas, null, 30));

            res.send({'message':'Sucess','data':tagDatas});
        }
    })

    

}
