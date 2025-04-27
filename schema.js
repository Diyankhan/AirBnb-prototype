const Joi = require("joi");

module.exports.listingData = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  category : Joi.string().required(),
}).required();

module.exports.reviewData = Joi.object({
  rating: Joi.number().min(0).required(),
  comments : Joi.string().required(),
}).required();
