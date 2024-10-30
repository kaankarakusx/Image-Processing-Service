import { Router } from "express";

import imageController from "../controllers/image.controller";
import upload from "../utils/multer";
import { validate } from "../middlewares/validate.middleware";
import { uploadImageSchema } from "../schemas/image.schema";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/all", authenticateToken, imageController.getImages);
router.get("/:id", authenticateToken, imageController.getImage);

router.post(
  "/",
  upload.single("file"),
  authenticateToken,
  validate(uploadImageSchema),
  imageController.uploadImage
);

router.put("/:id/transform", authenticateToken, imageController.transformImage);

export default router;
