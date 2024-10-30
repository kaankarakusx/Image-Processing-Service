import Joi from "joi";

export const imageTransformSchema = Joi.object({
  transformations: Joi.object({
    resize: Joi.object({
      width: Joi.number().required(),
      height: Joi.number().required(),
    }),
    crop: Joi.object({
      width: Joi.number().required(),
      height: Joi.number().required(),
    }),
    rotate: Joi.number,
    format: Joi.string(),
    filters: Joi.object({
      sepia: Joi.number(),
      greyscale: Joi.number(),
    }),
  }),
});
