import Joi from "joi";

export const createCategoryValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});

export const updateCategoryValidator = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
});

