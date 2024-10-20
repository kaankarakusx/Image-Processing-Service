import { Router } from "express";

import imageController from "../controllers/image.controller";
const router = Router();

router.post("/", imageController.uploadImage);

export default router;
