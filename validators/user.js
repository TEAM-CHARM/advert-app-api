import Joi from "joi";

export const createUserValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  businessName: Joi.string().optional(),
  businessEmail: Joi.string().optional(),
  businessPhone: Joi.string().optional(),
});

export const loginUserValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export const updateUserValidator = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
});