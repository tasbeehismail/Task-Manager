import Joi from 'joi';

const createTask = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title should have a minimum length of {#limit}',
      'string.max': 'Title should have a maximum length of {#limit}',
      'any.required': 'Title is required',
    }),
  type: Joi.string()
    .valid('Text', 'List')
    .required()
    .messages({
      'any.only': 'Type must be either Text or List',
      'string.empty': 'Type cannot be empty',
      'any.required': 'Type is required',
    }),
  text_body: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'Text body should be a type of text',
      'string.empty': 'Text body cannot be empty',
    }),
  list_items: Joi.array()
    .items(Joi.string().min(1))
    .optional()
    .messages({
      'array.base': 'List items should be an array of text',
      'array.includesRequiredUnknowns': 'List items cannot be empty',
    }),
  shared: Joi.boolean()
    .messages({
      'boolean.base': 'Shared should be a boolean value',
    }),
  category_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Category ID cannot be empty',
      'any.required': 'Category ID is required',
    })
});
const idTask = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Task ID cannot be empty',
      'any.required': 'Task ID is required',
      'string.pattern.base': 'Task ID is invalid',
    }),
});
export { createTask, idTask };
