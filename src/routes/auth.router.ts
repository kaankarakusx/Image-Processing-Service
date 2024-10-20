import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schemas/user.schema";

const router = Router();

router.post(
  "/register",
  validate(userRegistrationSchema),
  authController.register
);
router.post("/login", validate(userLoginSchema), authController.login);

export default router;
