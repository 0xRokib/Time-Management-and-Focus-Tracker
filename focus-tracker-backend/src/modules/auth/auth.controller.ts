import { NextFunction, Request, Response } from "express";
import { loginService, registerService } from "./auth.service";
import { LoginPayload, RegisterPayload } from "./auth.types";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password }: RegisterPayload = req.body;
    const user = await registerService(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message === "Email is already registered") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
};
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: LoginPayload = req.body;
    const token = await loginService(email, password);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
