var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateEvent = function(req, res, next) {
  var schema= {
    field_entity_profile_location: Joi.array().items(Joi.object().keys({
      entityType: Joi.string().required(),
      entityName: Joi.string().required(),
      enitity_array_location : Joi.array().items(Joi.object().keys({
        locationName:Joi.string().required(),
        street:Joi.string().required(),
        country:Joi.string().required()
      }))
    })),
    category_type_article: Joi.string().required(),
    title: Joi.string().required(),
    event_details: Joi.object().keys({
      field_website:Joi.string().required()
    }),
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


