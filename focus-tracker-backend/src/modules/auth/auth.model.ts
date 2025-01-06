import db from "../../config/db";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string
): Promise<User> => {
  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};
