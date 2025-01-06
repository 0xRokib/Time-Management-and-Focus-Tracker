import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, registerUser } from "./auth.model";
const dotenvConfig = require("../../config/dotenvConfig");

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return registerUser(name, email, hashedPassword);
};

export const loginService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }
  return jwt.sign({ id: user.id }, dotenvConfig.JWT_SECRET, {
    expiresIn: "1d",
  });
};
