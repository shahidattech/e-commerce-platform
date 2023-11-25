var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateArtist = function(req, res, next) {
  var schema= {
    artistName: Joi.string().required(),
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    nationality: Joi.string().required(),
    field_country: Joi.string().required()
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


