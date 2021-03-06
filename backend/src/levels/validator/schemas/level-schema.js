const Joi = require("joi");

const schema = Joi.object().keys({
  level: Joi.string().alphanum().min(3).max(15).required()
});

module.exports = schema;
