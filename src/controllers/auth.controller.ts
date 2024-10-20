import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    // register logic
    const { email, password } = req.body;
    try {
      const user = await authService.register(email, password);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error: unknown) {
      console.log(error);
      next(error);
    }
  }
}

export default new AuthController();
