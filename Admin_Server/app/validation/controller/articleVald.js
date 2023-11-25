var path = require('path');
var Joi = require('joi');
var restify = require('restify');
var _ = require('lodash');
var moment = require('moment');

exports.validateArticle = function (req, res, next) {
  var schema = {
    title: Joi.string().required(),
    userId: Joi.string().required(),
    article_page: Joi.string().required(),
    short_title: Joi.string().required(),
    summary: Joi.string().required(),

    //categoryRadio: {type:String,},
    category_type_article: Joi.string().required(),

    author_article: Joi.array().items(Joi.object().keys({
      profile: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
      }), //User Profiles
      userName: Joi.string().required(),
      salt: Joi.string().required(),
      hashedPwd: Joi.string().required(),
      userRole: Joi.string().required(),
    })),
    artistData: Joi.any().when('ReferenceArtist', {
      is: null, then: Joi.array().items(Joi.object().keys({
        artistName: Joi.string().required(),
        fname: Joi.string().required(),
        lname: Joi.string().required(),
        nationality: Joi.string().required(),
        field_country: Joi.string().required(),
      }))
    }),
    referencevenue: Joi.any().when('ReferenceVenue', {
      is: null, then: Joi.array().items(Joi.object().keys({
        entityType: Joi.string().required(),
        entityName: Joi.string().required(),
        enitity_array_location: Joi.array().items(Joi.object().keys({
          locationName: Joi.string().required(),
          street: Joi.string().required(),
          country: Joi.string().required()
        }))

      }))
    }),

    globalarticleRegion: Joi.string().required()
  }
  Joi.validate(req.body, schema, {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
  }, (err, value) => {
    if (err)
      return next(new restify.InvalidArgumentError(err.details[0].message));

    next();
  })
}


