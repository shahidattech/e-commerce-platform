var restify = require('restify');
var slideShowModel = require('mongoose').model('slideShowModel');
var slideshowHome = require('mongoose').model('homepageslideshowconfig');
var db_data_slideshow = require('../../../data/db_data_slideshow');
var url = require('url');
var slideshow_dict = {
    'Fairs_true_slideshow': {'sub_channel':{$elemMatch:{'Fairs': true}}},
    'Auctions_true_slideshow': {'sub_channel':{$elemMatch:{'Auctions': true}}},
    'Galleries_true_slideshow': {'sub_channel':{$elemMatch:{'Galleries': true}}},
    'Museums_true_slideshow': {'sub_channel':{$elemMatch:{'Museums': true}}},
    'Columnist_true_slideshow': {'sub_channel':{$elemMatch:{'Columnist': true}}},
    'Features_true_slideshow': {'sub_channel':{$elemMatch:{'Features': true}}},
    'Cultural_Experiences_true_slideshow': {'TravelSubs':{$elemMatch:{'Cultural Experiences': true}}},
    'Hotels_Resorts_true_slideshow': {'TravelSubs':{$elemMatch:{'Hotels & Resorts': true}}},
    'Shopping_true_slideshow': {'TravelSubs':{$elemMatch:{'Shopping': true}}},

    'Food_Wine_true_slideshow': {'TravelSubs':{$elemMatch:{'Food & Wine': true}}},
    'When_In_true_slideshow': {'TravelSubs':{$elemMatch:{'When In': true}}},
    'Cue_the_Concierge_true_slideshow': {'TravelSubs':{$elemMatch:{'Cue the Concierge': true}}},
    'The_Resident_true_slideshow': {'TravelSubs':{$elemMatch:{'The Resident': true}}},
    'The_Venturer_true_slideshow': {'TravelSubs':{$elemMatch:{'The Venturer': true}}},

    'Inspiration_travel_true_slideshow': {'TravelChannels':{$elemMatch:{'Inspiration': true}}},
    'Destinations_travel_true_slideshow': {'TravelChannels':{$elemMatch:{'Destinations': true}}},
    'People_travel_true_slideshow': {'TravelChannels':{$elemMatch:{'People': true}}},
   
    'Designer_Spotlight_fashion_true': {'FashionChannels':{$elemMatch:{'Designer Spotlight': true}}},
    'Runway_fashion_true': {'FashionChannels':{$elemMatch:{'Runway': true}}},
    
    'Auctions_lifesttylechannel_true': {'LifesytlesChannels':{$elemMatch:{'Auctions': true}}},
    //'Auctions_visual_arts_true': {'LifesytlesChannels':{$elemMatch:{'Auctions': true}}},
    
    'Food_Wine_lifesttylechannel_true': {'LifesytlesChannels':{$elemMatch:{'Food & Wine': true}}},
    'Jewelry_Watches_lifesttylechannel_true': {'LifesytlesChannels':{$elemMatch:{'Jewelry & Watches': true}}},
    'Autos_Boats_lifesttylechannel_true': {'LifesytlesChannels':{$elemMatch:{'Autos & Boats': true}}},
    'Film_performanceChannel_true': {'PerformanceChannels':{$elemMatch:{'Film': true}}},
    'Music_performanceChannel_true': {'PerformanceChannels':{$elemMatch:{'Music': true}}},
    'Television_performanceChannel_true': {'PerformanceChannels':{$elemMatch:{'Television': true}}},
    'Theatre_Dance_performanceChannel_true': {'PerformanceChannels':{$elemMatch:{'Theatre & Dance': true}}},

    'Architecture_architectural_true': {'ArchitectureChannels':{$elemMatch:{'Architecture': true}}},
    'Design_architectural_true': {'ArchitectureChannels':{$elemMatch:{'Design': true}}},
    'Home_Interiors_architectural_true': {'ArchitectureChannels':{$elemMatch:{'Home & Interiors': true}}},
}

exports.getslideshowSelectCategory = (req, res, next)=>{
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        if (params.fairs_slideshow_flag == 'true'){
        //    console.log(events_dict.Art_fairs_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Fairs_true_slideshow, res, next, function(result){
                res.send(result);
            });
        }
        else if(params.auction_slideshow_flag == 'true'){
           // console.log(slideshow_dict.Gallery_Shows_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Auctions_true_slideshow, res, next, function(result){
                res.send(result);
            });
        }else if(params.galleries_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Museum_Exhibitions_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Galleries_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.museums_slideshow_flag == 'true'){
           // console.log(slideshow_dict.Auctions_event_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Museums_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.columnist_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Talks_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Columnist_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.feature_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Theater_Dance_per_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Features_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }
        else if(params.cultural_experiences_slideshow_flag == 'true'){
           // console.log(slideshow_dict.Film_per_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Cultural_Experiences_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.hotel_resorts_flag == 'true'){
           // console.log(slideshow_dict.Music_per_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Hotels_Resorts_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.shopping_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Opera);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Shopping_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }
        else if(params.food_wine_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Food_Wine_life_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Food_Wine_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.when_in_slideshow_flag == 'true'){
           // console.log(slideshow_dict.Jewelry_Watches);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.When_In_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }
        else if(params.cue_the_concierge_flag == 'true'){
           // console.log(slideshow_dict.Auctions_life_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Cue_the_Concierge_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.the_resident_slideshow_flag == 'true'){
           // console.log(slideshow_dict.Auctions_life_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.The_Resident_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.the_venturer_slideshow_flag == 'true'){
            //console.log(slideshow_dict.Fashion_life_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.The_Venturer_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.inspiration_travel_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Inspiration_travel_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.travel_slideshow_destinations_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Video_travel_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.travel_slideshow_people_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.People_travel_true_slideshow, res, next, function(result){
                res.send(result);
            });

        }else if(params.designer_spotlight_fashion_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Designer_Spotlight_fashion_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.runway_fashion_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Runway_fashion_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.auction_lifestyle_channel_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Auctions_lifesttylechannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.food_wind_lifestyle_channel_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Food_Wine_lifesttylechannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.jewelry_watches_lifestyle_channel_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Jewelry_Watches_lifesttylechannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.autos_boats_lifestyle_channel_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Autos_Boats_lifesttylechannel_true, res, next, function(result){
                res.send(result);
            });

        }
        else if(params.film_performancec_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Film_performanceChannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.music_performance_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Music_performanceChannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.television_performance_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Television_performanceChannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.theatre_performance_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Theatre_Dance_performanceChannel_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.architecture_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Architecture_architectural_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.design_architectural_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Design_architectural_true, res, next, function(result){
                res.send(result);
            });

        }else if(params.home_interior_slideshow_flag == 'true'){
            //console.log(slideshow_dict.All_arc_true);
            db_data_slideshow.executeQuery(cursor, slideshow_dict.Home_Interiors_architectural_true, res, next, function(result){
                res.send(result);
            });

        }

       }

  }


// This function gets the details of Articles
exports.getSlideshow = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           summary:1,
           'files.uploadFiles':1,
           author_article:1,
           added_date:1,
           category_type_article:1,
           ArchitectureChannels:1,
           PerformanceChannels:1,
           LifesytlesChannels:1,
           FashionChannels:1,
           TravelChannels:1,
           TravelSubs:1,
           sub_channel:1
        };
   var query = cursor.find({}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

// This function gets by cateogry details
exports.getSlideshowByCategory = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           summary:1,
           shortTitle:1,
           author_article:1,
           added_date:1,
           category_type_article:1,
           TravelChannels:1,
           'files.uploadFiles':1,
           TravelSubs:1
        };
   var query = cursor.find({"category_type_article": "Travel"}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

// This function gets by cateogry details by architectue
exports.getSlideshowByCategoryArchitecture = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           description:1,
           shortTitle:1,
           author_article:1,
           added_date:1,
           ArchitectureChannels:1,
           'files.uploadFiles':1,
           category_type_article:1
         
        };
   var query = cursor.find({"category_type_article": "Architecture design"}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

// This function gets by cateogry details by lifestyle
exports.getSlideshowByCategoryLifestyle = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           description:1,
           shortTitle:1,
           author_article:1,
           added_date:1,
           category_type_article:1,
           LifesytlesChannels:1,
           'files.uploadFiles':1,
         
        };
   var query = cursor.find({"category_type_article": "Lifestyle"}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

// This function gets by cateogry details by fashion
exports.getSlideshowByCategoryFashion = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           description:1,
           shortTitle:1,
           author_article:1,
           added_date:1,
           category_type_article:1,
           FashionChannels:1,
           'files.uploadFiles':1,
         
        };
   var query = cursor.find({"category_type_article": "Fashion"}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

// This function gets by cateogry details by performing arts
exports.getSlideshowByCategoryPerformingArts = function (req, res, next){
    var cursor = slideShowModel;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var pages = params.page;
    let Projection = {
           title:1,
           description:1,
           shortTitle:1,
           author_article:1,
           category_type_article:1,
           added_date:1,
           PerformanceChannels:1,
           'files.uploadFiles':1,
         
        };
   var query = cursor.find({"category_type_article": "Performance & arts"}, Projection)
   const myCustomLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
        pagingCounter: 'pageCounter'
    };
    var options = {
          page: Number(pages),
          limit:20,
          pages: 5,
          customLabels: myCustomLabels,
          sort: { added_date: -1 },
         // customLabels: myCustomLabels
        };
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.paginate(query, options, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
};

exports.getSlideshowById = (req,res,next)=>{
     var cursor = slideShowModel;
    let slideshowId = req.params.slideshowId;
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.findByIdAndUpdate({"_id":slideshowId}, { $inc: { views: 1 } },{ $push: { timestamp: new Date() }}, function(err, objs){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":objs});
            }
        });
    }    
   
};
exports.getslideshowByCountry = (req, res, next)=>{
    var cursor = slideshowHome;
    var url_data = url.parse(req.url, true);
    var params = url_data.query;
    var countryCode = params.countryCode;
   
    if (!cursor){
        return next(new restify.errors.InternalServ3erError('Model instance(s) is not defined'));
    }
    else{
        cursor.find({'country_abb':countryCode},function(err, result){
            if (err) {
                return next(new restify.errors.InternalServerError(err));
            } else {
                res.status(200);
                res.send({"result":result});
            }
        });
    }    
};
// exports.getslideshowByCountry = function (req, res, next){
//     var url_data = url.parse(req.url, true);
//     if (url_data.query.country_name in country_abb_dict){
//         console.log(url_data.query.country_name);
//         var cursor = slideshowHome;
//         db_data.executeQuery(cursor, {"country_abb": country_abb_dict[url_data.query.country_name]}, res, next, function(result){
//             res.send(result);
//         });
//     }
//     else{
//         res.send({"result": "Name not Exist"});
//     }
    
// };