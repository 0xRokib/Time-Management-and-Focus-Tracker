import { Request, Response } from "express";
import { login, register } from "./auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      throw new Error("Missing required fields");
    const token = await register(name, email, password);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Missing required fields");
    const { token, user } = await login(email, password);
    console.log(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
