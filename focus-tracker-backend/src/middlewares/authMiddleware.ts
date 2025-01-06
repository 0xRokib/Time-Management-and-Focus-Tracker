import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const dotenvConfig = require("../config/dotenvConfig");
interface User {
  id: number;
}
interface RequestWithUser extends Request {
  user?: User;
}

const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }
  try {
    const decoded = jwt.verify(token, dotenvConfig.JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
