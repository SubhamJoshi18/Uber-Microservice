import Joi from 'joi';

const updateSchemaBody = Joi.object({
  location: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Location must be a string.',
      'string.empty': 'Location is required.',
      'string.alphanum': 'Location must only contain letters and numbers.',
      'string.min': 'Location must be at least 3 characters long.',
      'string.max': 'Location cannot exceed 30 characters.',
    }),
  secondaryEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email is required.',
      'string.email': 'Email must be a valid email address.',
    }),
})

export {
    updateSchemaBody
}