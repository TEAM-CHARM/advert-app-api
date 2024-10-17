import Joi from "joi";

 export const createAdvertValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    imageURL: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    organizer: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().required(),
    attendees: Joi.array().items(Joi.string()).required(),
  });

  export const updateAdvertValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    imageURL: Joi.string(),
    price: Joi.number(),
    category: Joi.string(),
    organizer: Joi.string(),
    location: Joi.string(),
    date: Joi.date(),
    attendees: Joi.array().items(Joi.string()),
  });