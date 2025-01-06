import db from "../../config/db";
interface FocusSession {
  id: number;
  user_id: number;
  duration: number;
  timestamp: Date;
}

export const getFocusSessionsFromDB = async (
  userId: number
): Promise<FocusSession[]> => {
  const result = await db.query(
    `SELECT * FROM focus_sessions WHERE user_id = $1 ORDER BY timestamp DESC`,
    [userId]
  );
  return result.rows;
};
