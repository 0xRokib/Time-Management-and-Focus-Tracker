import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, User } from "./auth.model";
const dotenvConfig = require("../../config/dotenvConfig");

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
  const existingUser = await findUserByEmail(email);
  console.log(existingUser);
  if (existingUser) {
    throw {
      message: "User already exists",
      statusCode: 400,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(name, email, hashedPassword);

  return generateToken(newUser.id);
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = generateToken(user.id);

  return { token, user };
};

const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, dotenvConfig.JWT_SECRET, { expiresIn: "7d" });
};
