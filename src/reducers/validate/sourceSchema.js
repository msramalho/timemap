import Joi from "joi";

const sourceSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().allow(""),
  paths: Joi.array().default([]),//.required(),
  affil_s: Joi.array().allow(""),
  parent: Joi.string().allow(""),
  author: Joi.string().allow(""),
  date: Joi.string().allow(""),
  notes: Joi.string().allow(""),

  civcasid: Joi.string().allow(""),
  url: Joi.string().allow(""),
  archive: Joi.string().allow(""),
  thumbnail: Joi.string().allow(""),
  violence: Joi.string().allow(""),
  type: Joi.string().allow(""),
  description: Joi.string().allow(""),
});

export default sourceSchema;
