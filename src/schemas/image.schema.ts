import Joi from "joi";

export const uploadImageSchema = Joi.object({
  metadata: Joi.string(),
});
