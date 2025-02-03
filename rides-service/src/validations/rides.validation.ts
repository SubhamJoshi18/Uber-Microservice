import Joi from 'joi';




const createRidesSchema = Joi.object({
  currentLocation: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
          'string.base': 'Current Location must be a string.',
          'string.empty': 'Current Location is required.',
          'string.pattern.base': 'Current Location can only contain letters, numbers, and spaces.',
          'string.min': 'Current Location must be at least 3 characters long.',
          'string.max': 'Current Location cannot exceed 50 characters.',
      }),

  geometry: Joi.object({
      lat: Joi.number()
          .min(-90)
          .max(90)
          .required()
          .messages({
              'number.base': 'Latitude must be a number.',
              'number.min': 'Latitude must be at least -90.',
              'number.max': 'Latitude cannot exceed 90.',
              'any.required': 'Latitude is required.'
          }),
      lng: Joi.number()
          .min(-180)
          .max(180)
          .required()
          .messages({
              'number.base': 'Longitude must be a number.',
              'number.min': 'Longitude must be at least -180.',
              'number.max': 'Longitude cannot exceed 180.',
              'any.required': 'Longitude is required.'
          })
  }).required()
  .messages({
      'object.base': 'Geometry must be an object with valid latitude and longitude.',
      'any.required': 'Geometry is required.'
  }),

  destination: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
          'string.base': 'Destination Location must be a string.',
          'string.empty': 'Destination Location is required.',
          'string.pattern.base': 'Destination Location can only contain letters, numbers, and spaces.',
          'string.min': 'Destination Location must be at least 3 characters long.',
          'string.max': 'Destination Location cannot exceed 50 characters.',
      }),

  price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
          'number.base': 'Price must be a number.',
          'number.positive': 'Price must be a positive number.',
          'number.precision': 'Price can have up to two decimal places.',
          'any.required': 'Price is required.'
      }),
});


export {
  createRidesSchema
}