import { NextFunction, Request, Response } from "express";
import imageService from "../services/image.service";

class ImageController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Please upload an image" });
        return;
      }

      const userId = req.user?.id as number;

      const data = await imageService.uploadImage(
        file,
        req.body.metadata,
        userId
      );

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }

  async transformImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { transformations } = req.body;
      const userId = req.user?.id as number;

      await imageService.transformImage(Number(id), transformations, userId);

      res.status(200).json({
        success: true,
        message: "Image transformed successfully",
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }

  async getImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const userId = req.user?.id as number;

      const image = await imageService.getImage(Number(id), userId);

      res.status(200).json({
        success: true,
        data: image,
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }

  async getImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;

      const userId = req.user?.id as number;

      const images = await imageService.getImages(
        Number(page),
        Number(limit),
        userId
      );

      res.status(200).json({
        success: true,
        data: images,
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }
}

export default new ImageController();
