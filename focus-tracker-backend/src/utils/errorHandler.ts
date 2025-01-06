import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  res.status(500).json({
    error: "Something went wrong!",
  });
};
