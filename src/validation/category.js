import Joi from 'joi';

const addCategory = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .lowercase()
    .required()
    .messages({
      'string.base': 'Category name should be a type of text',
      'string.empty': 'Category name cannot be empty',
      'string.min': 'Category name should have a minimum length of {#limit}',
      'string.max': 'Category name should have a maximum length of {#limit}',
      'any.required': 'Category name is required',
    }),
  user_id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'User ID cannot be empty',
      'any.required': 'User ID is required',
    }),
});

const idCategory = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Category ID cannot be empty',
      'any.required': 'Category ID is required',
      'string.pattern.base': 'Category ID is invalid',
    }),
});

const updateCategory = Joi.object({
  id: Joi.string()  
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Category ID cannot be empty',
      'any.required': 'Category ID is required',
      'string.pattern.base': 'Category ID is invalid',
    }),
  name: Joi.string()
    .min(3)
    .max(255)
    .lowercase()
    .messages({
      'string.base': 'Category name should be a type of text',
      'string.empty': 'Category name cannot be empty',
      'string.min': 'Category name should have a minimum length of {#limit}',
      'string.max': 'Category name should have a maximum length of {#limit}',
    }),
});

export { addCategory, idCategory, updateCategory };
