import { Router } from "express";

import authRouter from "./auth.router";
import imagesRouter from "./image.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/images", imagesRouter);

export default router;
