import db from "../../config/db";
export interface FocusSession {
  id: number;
  user_id: number;
  duration: number;
  timestamp: Date;
}

export const logFocusSessionInDB = async (
  userId: number,
  duration: number
): Promise<FocusSession> => {
  const result = await db.query(
    "INSERT INTO focus_sessions (user_id, duration) VALUES ($1, $2) RETURNING *",
    [userId, duration]
  );
  return result.rows[0];
};
