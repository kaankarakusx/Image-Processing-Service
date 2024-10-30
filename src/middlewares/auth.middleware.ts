import { Request, Response, NextFunction } from "express";
import jwtUtils from "../utils/jwtUtils";
import { IUserPayload } from "../interfaces/IUserPayload";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ message: "Token header is missing in the request!" });
    return;
  }

  try {
    const decoded = await jwtUtils.verifyAccessToken(token);
    req.user = decoded as IUserPayload;
    next();
  } catch (error: unknown) {
    console.error(error);
    res.status(403).json({ message: "Invalid token" });
  }
};
