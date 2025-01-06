import { NextFunction, Request, Response } from "express";

export const validateFocusSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { duration } = req.body;

  if (typeof duration !== "number" || duration <= 0) {
    return res
      .status(400)
      .json({ error: "Duration must be a positive number" });
  }

  next();
};
