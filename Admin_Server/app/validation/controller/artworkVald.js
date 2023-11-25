var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateArtwork = function(req, res, next) {
  var schema= {
    entityLocation: Joi.array().items(Joi.object().keys({
      entityType: Joi.string().required(),
      entityName: Joi.string().required(),
      locationName:Joi.string().required(),
      street:Joi.string().required(),
      country:Joi.string().required(),
    })),
    artworkType: Joi.string().required(),
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


