var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateSlideShow = function(req, res, next) {
  var schema= {
    title: Joi.string().required(),
    shortTitle: Joi.string().required(),
    category_type_article: Joi.string().required(),
    author_article:Joi.array().items(Joi.object().keys({
      userName: Joi.string().required(),
      userRole: Joi.string().required()
    }))
  }
  Joi.validate(req.body,schema,{
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true
  },(err,value)=>{
    if (err)
      return next(new restify.InvalidArgumentError(err.details[0].message));

    next();
  })
}


