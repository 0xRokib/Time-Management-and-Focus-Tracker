import db from "../config/db";

export const findUserById = async (userId: number) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
};
