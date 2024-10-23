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
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    role: Joi.string().optional().valid("vendor", "user"),
    avatar: Joi.string().optional(),
    businessName: Joi.string().optional(),
    businessEmail: Joi.string().optional(),
    businessPhone: Joi.string().optional(),
});