import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, User } from "./auth.model";
const dotenvConfig = require("../../config/dotenvConfig");

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
  try {
    console.log("Starting registration process...");
    console.log("Checking for existing user with email:", email);

    // Step 1: Check if the user already exists
    const existingUser = await findUserByEmail(email);
    console.log("Result from findUserByEmail:", existingUser);

    if (existingUser) {
      console.warn("User already exists with email:", email);
      throw {
        message: "User already exists",
        statusCode: 400,
      };
    }

    // Step 2: Hash the password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    // Step 3: Create a new user
    console.log("Creating a new user...");
    const newUser = await createUser(name, email, hashedPassword);
    console.log("New user created:", newUser);

    // Step 4: Generate and return a token
    console.log("Generating token...");
    const token = generateToken(newUser.id);
    console.log("Token generated successfully.");
    return token;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error; // Propagate error for frontend handling
  }
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
