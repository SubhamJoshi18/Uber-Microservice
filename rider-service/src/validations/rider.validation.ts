import Joi from 'joi';

const createRiderSchema = Joi.object({
  riderName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Rider Name must be a string.',
      'string.empty': 'Rider Name is required.',
      'string.alphanum': 'Rider Name must only contain letters and numbers.',
      'string.min': 'Rider Name must be at least 3 characters long.',
      'string.max': 'Rider Name cannot exceed 30 characters.',
    }),
})

const updatedRiderSchema = Joi.object({
  riderName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Rider Name must be a string.',
      'string.empty': 'Rider Name is required.',
      'string.alphanum': 'Rider Name must only contain letters and numbers.',
      'string.min': 'Rider Name must be at least 3 characters long.',
      'string.max': 'Rider Name cannot exceed 30 characters.',
    }),
})


const riderReportSchema = Joi.object({
  reportComment : Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Report Comment must be a string.',
      'string.empty': 'Report Comment is required.',
      'string.alphanum': 'Report Comment must only contain letters and numbers.',
      'string.min': 'Report Comment  must be at least 3 characters long.',
      'string.max': 'Report Comment  cannot exceed 30 characters.',
    }),
})

export {
    createRiderSchema,
    riderReportSchema,
    updatedRiderSchema
}