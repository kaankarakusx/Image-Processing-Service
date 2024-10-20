import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi"; // Joi Schema tipini import ediyoruz

// Genel doğrulama middleware'i
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    next();
  };
};
