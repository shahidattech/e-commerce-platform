var restify = require('restify');
var mongoose = require('mongoose');
var articleModel = require('mongoose').model('articleModel');
var slideShowModel = require('mongoose').model('slideShowModel');
var db_data = require('../../../data/db_data');
var db_data_homepage = require('../../../data/db_data_homepage');
var jwt = require('../../../service/auth/jwt')
var featureChecker = require('../../../service/auth/featureChecker');
var _ = require('underscore');
var articleHome = require('mongoose').model('homepageconfig');
var slideshowHome = require('mongoose').model('homepageslideshowconfig');
var url = require('url');
sub_channel_abb = {
    "Fairs": "Fairs",
    "Auctions" : "Auctions",
    "Galleries" : "Galleries",
    "Museums" : "Museums",
    "Columnist" : "Columnist",
    "Features" : "Features"
}
sub_sub_abb = {
     "News" : "News",
    "Previews" : "Previews",
    "Reviews" : "Reviews",
    "Parties" : "Parties",
    "Videos" : "Videos"
}
ArchitectureChannels_abb = {
     "Architecture" : "Architecture",
     "Design" : "Design",
     "Home & Interiors" : "Home & Interiors"
}
ArchitectureSubs_abb = {
     "News" : "News",
     "Reviews" : "Reviews",
     "Video" : "Video"
}
PerformanceChannels_abb = {
     "Film" : "Film",
     "Music" : "Music",
     "Television" : "Television",
     "Theatre & Dance": "Theatre & Dance"
}
PerformanceSubs_abb = {
     "News" : "News",
     "Reviews" : "Reviews",
     "Video" : "Video",
     "Parties": "Parties"
}
LifesytlesChannels_abb = {
     "Food & Wine" : "Food & Wine",
     "Jewelry & Watches" : "Jewelry & Watches",
     "Autos & Boats" : "Autos & Boats",
     "Auctions": "Auctions"
}
LifesytlesSubs_abb = {
     "News" : "News",
     "Video" : "Video",
     "Parties" : "Parties"
}
FashionChannels_abb = {
     "Designer Spotlight" : "Designer Spotlight",
     "Runway" : "Runway",
     "Style Guide" : "Style Guide",
     "Accessories": "Accessories",
     "Exhibitions": "Exhibitions"
}
FashionSubs_abb = {
     "News" : "News",
     "Reviews" : "Reviews",
     "Video" : "Video",
     "Parties": "Parties"
}
TravelChannels_abb = {
     "Inspiration" : "Inspiration",
     "Video" : "Video",
     "People" : "People"
}
TravelSubs_abb = {
     "Cultural Experiences" : "Cultural Experiences",
     "Hotels & Resorts" : "Hotels & Resorts",
     "Shopping" : "Shopping",
     "Food & Wine": "Food & Wine",
     "When In": "When In",
     "Cue the Concierge": "Cue the Concierge",
     "The Resident": "The Resident",
     "The Venturer": "The Venturer"
}
country_abb_dict = {
    "All" : "ALL",
    "International" : "INTR",
    "Australia" : "AU",
    "Canada" : "CA",
    "China" : "CHINA",
    "France" : "FR",
    "Germany" : "GE",
    "HongKong" : "HK",
    "India" : "IND",
    "Italy" : "ITL",
    "Japan" : "JP",
    "Korea" : "KR",
    "MiddleEast" : "ME",
    "Spain" : "ES",
    "Uk" : "UK"
};

// slider part
exports.createArticleCountryPos = function (req, res, next) {
     console.log(req.body);
     var cursor = articleModel;
     var params = req.body;
     if (!cursor){
         return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
     }
     else {
         db_data.executeQuery(cursor, {"_id" : params._id}, res, next, function(result){
             //console.log(result.result[0].All_country[0]);
             var query_result = result.result[0];
             // res.send(result);
             _.each(query_result.All_country[0].toObject(), function (value, key) {
                 // handle
                 if (value == true){
                            var rs = {
                         "articleId": params._id,
                         "country_abb": country_abb_dict[key],
                         "pos": params.pos,
                         "sliders": [{
                    
                             "country_abb": params.country_abb,
                             "author": query_result.author_article,
                             "image": query_result.files[0].sliderImg,
                             "sub_cat_label": "Temp",
                             "short_title": query_result.short_title,
                             "summary": query_result.summary, 
                             "date_stamp": query_result.added_date,
                             "pos": params.pos
                         }]
                     };
                    articleHome.findOne({"country_abb": params.country_abb, "pos": params.pos}).then(result => {
                         if (result) {
                          //   res.send("Id is already exist");
                           articleHome.findOneAndUpdate({"country_abb": params.country_abb,"pos": params.pos}, rs, function (err, article) {
                           if (err) {
                             return next(new restify.errors.InternalServerError(err));
                           } else {
                             res.status(200);
                             //console.log(article);
                             res.send({"result": "data is update now"});
                         }
                         });
                            // res.send({"Id" : " is already exist in table. Please use update api for this"});
                         }else{
                            articleHome.create(rs, function (err, article) {
                           if (err) {
                             return next(new restify.errors.InternalServerError(err));
                           } else {
                             res.status(200);
                             //console.log(article);
                             res.send({"result": "data saved to database"});
                         }
                         });
                         }
                     });
                   
                 }
             });
         });
     }
 };
 
exports.createTrendingArticle = function (req, res, next) {
    console.log(req.body);
    var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data.executeQuery(cursor, {"_id" : params._id}, res, next, function(result){
            console.log(result.result[0].All_country[0]);
            var query_result = result.result[0];
            // // res.send(result);
            _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                    // console.log(query_result.sub_subs);
                    // // console.log(country_abb_dict[key]);
                    // console.log(query_result.short_title);
                    // console.log(query_result.files[0].feature_image);
                    // console.log(query_result.author_article);
                    // console.log(query_result.added_date);
                    var rs = {
                        "articleId": params._id,
                        "country_abb": country_abb_dict[key],
                        "pos": params.pos,
                        "trending" :[{
                            "country_abb":  params.country_abb,
                            "author": query_result.author_article,
                            "image": query_result.files[0].uploadFiles,
                            "sub_subs": query_result.sub_subs,
                            "short_title": query_result.short_title,
                            "date_stamp": query_result.added_date,
                            "pos": params.pos
                        }]
                    };
                   articleHome.findOne({"country_abb": params.country_abb,"pos": params.pos}).select("country_abb").then(result => {
                        if (result) {
                         //   res.send("Id is already exist");
                          articleHome.findOneAndUpdate({"country_abb": params.country_abb,"pos": params.pos}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                           articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                        }
                    });
                }
            });
        });
    }
};


exports.topGlobalStories = function (req, res, next) {
    console.log(req.body);
    var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data.executeQuery(cursor, {"_id" : params._id}, res, next, function(result){
            console.log(result.result[0].All_country[0]);
            var query_result = result.result[0];
            // // res.send(result);
            _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                    var rs = {
                        "articleId": params._id,
                        "country_abb": country_abb_dict[key],
                        "pos": params.pos,
                        "topGlobalStories" : [{
                            "articleId": params._id,
                            "country_abb":  params.country_abb,
                            "author": query_result.author_article,
                            "image": query_result.files[0].paragraph_img,
                            "summary": query_result.summary,
                            "short_title": query_result.short_title,
                            "region": query_result.globalarticleRegion,
                            "date_stamp": query_result.added_date,
                            "pos": params.pos
                        }]
                    };
                    articleHome.findOne({"country_abb": params.country_abb,"pos": params.pos}).then(result => {
                        if (result) {
                         //   res.send("Id is already exist");
                          articleHome.findOneAndUpdate({"country_abb": params.country_abb,"pos": params.pos}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                           articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                        }
                    });
                }
            });
        });
    }
};
exports.features = function (req, res, next) {
    console.log(req.body);
    var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data.executeQuery(cursor, {"_id" : params._id}, res, next, function(result){
            console.log(result.result[0].All_country[0]);
            var query_result = result.result[0];
            res.send(result);
            _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                    var rs = {
                        "articleId": params._id,
                        "country_abb": country_abb_dict[key],
                        "pos": params.pos,
                        "features" :[{
                            "author": query_result.author_article,
                            "country_abb":  params.country_abb,
                            "image": query_result.files[0].paragraph_img,
                            "summary": query_result.summary,
                            "short_title": query_result.short_title,
                            "date_stamp": query_result.added_date,
                             "pos": params.pos
                        }]
                    };
                    articleHome.findOne({"country_abb":  params.country_abb,"pos": params.pos}).select("country_abb").then(result => {
                        if (result) {
                         //   res.send("Id is already exist");
                          articleHome.findOneAndUpdate({"country_abb":  params.country_abb,"pos": params.pos}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                           articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
exports.popularSlideshows = function (req, res, next) {
    //console.log(req.body);
    var slideshow = slideShowModel;
    var params = req.body;
    if (!slideshow){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data.executeQuery(slideshow, {"_id" : params._id},  res, next, function(result){
           // console.log("_id" + params._id);
            var query_result = result.result[0];
            //res.send(query_result);
           //console.log(query_result);
            _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                    var rs = {
                        "country_abb":  country_abb_dict[key],
                        "added_date": query_result.added_date,
                        "pos": params.pos,
                        "popularSlideshows" :[{
                            "country_abb":  params.country_abb,
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "views": query_result.views,
                            "timestamp": query_result.timestamp,
                            "pos":params.pos
                        }]
                    };
                    articleHome.findOne({"country_abb":  params.country_abb,"pos": params.pos}).select("country_abb").then(result => {
                        if (result) {
                         //   res.send("Id is already exist");
                          articleHome.findOneAndUpdate({"country_abb":  params.country_abb,"pos": params.pos}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                           articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                             console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
// visual arts code
exports.UpdateVisualArts = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"visual_arts_type" : params.visual_arts_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           console.log(query_result.sub_channel);
           _.each(query_result.sub_channel[0].toObject(), function (value, key) {
                // handle
               //console.log(sub_channel_abb[key]);     
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "visual_arts_type" : params.visual_arts_type,
                        "visual_arts" :[{
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "sub_channel": query_result.sub_channel,
                            "sub_subs": query_result.sub_subs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        }
                        ,{
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "sub_channel": query_results.sub_channel,
                            "sub_subs": query_results.sub_channel,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "sub_channel": query_resultss.sub_channel,
                            "sub_subs": query_resultss.sub_channel,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }
                        ]
                    };
                    articleHome.find({"visual_arts_type" : params.visual_arts_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                           // console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"visual_arts_type" : params.visual_arts_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            //console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};

// Architecture code

exports.UpdateArchitectureDesign = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"architecture_design_type" : params.architecture_design_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "architecture_design_type" : params.architecture_design_type,
                        "architecture_design" :[{
                            "country_abb":  country_abb_dict[key],
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "ArchitectureChannels": query_result.ArchitectureChannels,
                            "ArchitectureSubs": query_result.ArchitectureSubs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "ArchitectureChannels": query_results.ArchitectureChannels,
                            "ArchitectureSubs": query_results.ArchitectureSubs,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "ArchitectureChannels": query_resultss.ArchitectureChannels,
                            "ArchitectureSubs": query_resultss.ArchitectureSubs,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }]
                    };
                    articleHome.find({"architecture_design_type" : params.architecture_design_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"architecture_design_type" : params.architecture_design_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
//performing arts
exports.UpdatePerformingarts = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"performance_design_type" : params.performance_design_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "performance_design_type" : params.performance_design_type,
                        "performance_arts" :[{
                            "country_abb":  country_abb_dict[key],
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "PerformanceChannels": query_result.PerformanceChannels,
                            "PerformanceSubs": query_result.PerformanceSubs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "PerformanceChannels": query_results.PerformanceChannels,
                            "PerformanceSubs": query_results.PerformanceSubs,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "PerformanceChannels": query_resultss.PerformanceChannels,
                            "PerformanceSubs": query_resultss.PerformanceSubs,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }]
                    };
                    articleHome.find({"performance_design_type" : params.performance_design_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"performance_design_type" : params.performance_design_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
//lifestyle design
exports.UpdateLifestyleDesign = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"lifestyle_design_type" : params.lifestyle_design_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "lifestyle_design_type" : params.lifestyle_design_type,
                        "lifestyle_design" :[{
                            "country_abb":  country_abb_dict[key],
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "LifesytlesChannels": query_result.LifesytlesChannels,
                            "LifesytlesSubs": query_result.LifesytlesSubs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "LifesytlesChannels": query_results.LifesytlesChannels,
                            "LifesytlesSubs": query_results.LifesytlesSubs,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "LifesytlesChannels": query_resultss.LifesytlesChannels,
                            "LifesytlesSubs": query_resultss.LifesytlesSubs,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }]
                    };
                    articleHome.find({"lifestyle_design_type" : params.lifestyle_design_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"lifestyle_design_type" : params.lifestyle_design_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
// Fashion design
exports.UpdateFashionDesign = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"fashion_design_type" : params.fashion_design_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "fashion_design_type" : params.fashion_design_type,
                        "fashion_design" :[{
                            "country_abb":  country_abb_dict[key],
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "FashionChannels": query_result.FashionChannels,
                            "FashionSubs": query_result.FashionSubs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "FashionChannels": query_results.FashionChannels,
                            "FashionSubs": query_results.FashionSubs,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "FashionChannels": query_resultss.FashionChannels,
                            "FashionSubs": query_resultss.FashionSubs,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }]
                    };
                    articleHome.find({"fashion_design_type" : params.fashion_design_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"fashion_design_type" : params.fashion_design_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
// Travel
exports.UpdateTravel = function (req, res, next) {
    //console.log(req.body);
   var cursor = articleModel;
    var params = req.body;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else {
        db_data_homepage.executeQuery(cursor, {"travel_design_type" : params.travel_design_type },  res, next, function(result){
           // console.log("_id" + params._id);
           var query_result = result.result[0];
           var query_results = result.result[1];
           var query_resultss = result.result[2];
           _.each(query_result.All_country[0].toObject(), function (value, key) {
                // handle
                if (value == true){
                     var rs = {
                    //    "articleId": params._id,
                       "travel_design_type" : params.travel_design_type,
                        "travel_design" :[{
                            "country_abb":  country_abb_dict[key],
                            "image": query_result.files[0].uploadFiles,
                            "title": query_result.title,
                            "TravelChannels": query_result.TravelChannels,
                            "TravelSubs": query_result.TravelSubs,
                            "summary": query_result.summary,
                            "added_date":query_result.added_date,
                            "articleId":query_result.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_results.files[0].uploadFiles,
                            "title": query_results.title,
                            "TravelChannels": query_results.TravelChannels,
                            "TravelSubs": query_results.TravelSubs,
                            "summary": query_results.summary,
                            "added_date":query_results.added_date,
                            "articleId":query_results.articleId
                        },{
                            "country_abb":  country_abb_dict[key],
                            "image": query_resultss.files[0].uploadFiles,
                            "title": query_resultss.title,
                            "TravelChannels": query_resultss.TravelChannels,
                            "TravelSubs": query_resultss.TravelSubs,
                            "summary": query_resultss.summary,
                            "added_date":query_resultss.added_date,
                            "articleId":query_resultss.articleId
                        }]
                    };
                    articleHome.find({"travel_design_type" : params.travel_design_type}).then(result => {
                        //res.send(result);
                        if (result == '') {
                         articleHome.create(rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            res.send({"result": "data saved to database"});
                        }
                        });
                           
                           // res.send({"Id" : " is already exist in table. Please use update api for this"});
                        }else{
                          articleHome.update({"travel_design_type" : params.travel_design_type}, rs, function (err, article) {
                          if (err) {
                            return next(new restify.errors.InternalServerError(err));
                          } else {
                            res.status(200);
                            console.log(article);
                            //console.log(article);
                            res.send({"result": "data is update now"});
                        }
                        });
                        }
                    });

                }
            });
        });
    }
};
exports.getArticleByCountry = function (req, res, next){
    var url_data = url.parse(req.url, true);
    if (url_data.query.country_name in country_abb_dict){
        console.log(url_data.query.country_name);
        var cursor = articleHome;
        db_data.executeQuery(cursor, {"country_abb": country_abb_dict[url_data.query.country_name]}, res, next, function(result){
            res.send(result);
        });
    }
    else{
        res.send({"result": "Name not Exist"});
    }
    
};

exports.updatearticle = function (req, res,next) {
    articleHome.findByIdAndUpdate({"_id": req.params._id}, {$set: req.body}, function (err, user) {
        console.log(err, user);
        if (err) {
             return next(new Restify.errors.InternalServerError(err));
         }
        res.status(200);
        res.send('User updated');
         next();
    });
}; 
 

exports.getArticle = (req,res,next)=>{
    let articleId = req.params.articleId;
    articleHome.find({},(err,data)=>{
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(data);
        }
    });
};
exports.getSlideshow = (req,res,next)=>{
    let articleId = req.params.slideshowId;
    slideshowHome.find({},(err,data)=>{
        if (err) {
            return next(new restify.errors.InternalServerError(err));
        } else {
            res.status(200);
            res.send(data);
        }
    });
};

exports.getArticleByUserId = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    var userId = req.params._id;
   // console.log(userId);
    articleHome.find({},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.getSlideshowByUserId = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    const numberOfDaysToLookBack = req.query.days ? req.query.days : 1;
    var userId = req.params._id;
   // console.log(userId);
    slideshowHome.find({added_date:{ $gte: new Date((new Date().getTime() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000))) }},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.getSlideshowByUserIdWeek = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    const numberOfDaysToLookBack = req.query.days ? req.query.days : 7;
    var userId = req.params._id;
   // console.log(userId);
    slideshowHome.find({added_date:{ $gte: new Date((new Date().getTime() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000))) }},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.getSlideshowByUserIdMonth = function (req,res,next){
    jwt.validateToken;
    featureChecker.hasAccessToFeatureNew;
    const numberOfDaysToLookBack = req.query.days ? req.query.days : 31;
    var userId = req.params._id;
   // console.log(userId);
    slideshowHome.find({added_date:{ $gte: new Date((new Date().getTime() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000))) }},function(err,data){
        if(err){
            res.send({status:'failure',response:err});
        }else{
            res.send({status:'Success',response:data});
        }
    });
};
exports.deletetopGlobalStories = (req,res,next)=>{

var article_id = req.params.articleId,//assume get 54fcb3890cba9c4234f5c925
    topGlobalStoriesID_id = req.params.topGlobalStoriesID;// assume get 54fcb3890cba9c4234f5c925
  
  articleHome.findByIdAndUpdate(article_id, { $pull: { 'topGlobalStories': {  _id: topGlobalStoriesID_id } } },function(err,model){
      if(err){
           console.log(err);
           return res.send(err);
        }
        return res.json(model);
    });

};
exports.deletepopularslideshow = (req,res,next)=>{

var slideshow_id = req.params.slideshowId,//assume get 54fcb3890cba9c4234f5c925
    popularSlideshowsID_id = req.params.popularSlideshowsID;// assume get 54fcb3890cba9c4234f5c925
  
  slideshowHome.findByIdAndUpdate(slideshow_id, { $pull: { 'popularSlideshows': {  _id: popularSlideshowsID_id } } },function(err,model){
      if(err){
           console.log(err);
           return res.send(err);
        }
        return res.json(model);
    });

};

exports.deleteSliders = (req,res,next)=>{

var article_id = req.params.articleId,//assume get 54fcb3890cba9c4234f5c925
    SliderID_id = req.params.SliderID;// assume get 54fcb3890cba9c4234f5c925
  
  articleHome.findByIdAndUpdate(article_id, { $pull: { 'sliders': {  _id: SliderID_id } } },function(err,model){
      if(err){
           console.log(err);
           return res.send(err);
        }
        return res.json(model);
    });

};
exports.trendingConfig = (req,res,next)=>{

var article_id = req.params.articleId,//assume get 54fcb3890cba9c4234f5c925
    TreindingConfigId_id = req.params.TreindingConfigId;// assume get 54fcb3890cba9c4234f5c925
  
  articleHome.findByIdAndUpdate(article_id, { $pull: { 'trending': {  _id: TreindingConfigId_id } } },function(err,model){
      if(err){
           console.log(err);
           return res.send(err);
        }
        return res.json(model);
    });

};
exports.FeaturesConfig = (req,res,next)=>{

var article_id = req.params.articleId,//assume get 54fcb3890cba9c4234f5c925
    FeaturesID_id = req.params.FeaturesID;// assume get 54fcb3890cba9c4234f5c925
  
  articleHome.findByIdAndUpdate(article_id, { $pull: { 'features': {  _id: FeaturesID_id } } },function(err,model){
      if(err){
           console.log(err);
           return res.send(err);
        }
        return res.json(model);
    });

};
