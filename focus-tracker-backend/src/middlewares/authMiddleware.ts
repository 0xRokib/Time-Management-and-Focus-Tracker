import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const dotenvConfig = require("../../config/dotenvConfig");

interface AuthPayload {
  userId: number;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, dotenvConfig.JWT_SECRET) as AuthPayload;
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
