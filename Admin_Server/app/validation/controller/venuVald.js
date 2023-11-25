var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateVenu = function(req, res, next) {
  var schema= {
    entityType: Joi.string().required(),
    entityName: Joi.string().required(),
    enitity_array_location : Joi.array().items(Joi.object().keys({
      locationName: Joi.string().required(),
      street: Joi.string().required(),
      country: Joi.string().required(),
      }))
  }
  Joi.validate(req.body,schema,{
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
   // stripUnknown: true
  },(err,value)=>{
    if (err)
      return next(new restify.InvalidArgumentError(err.details[0].message));

    next();
  })
}


