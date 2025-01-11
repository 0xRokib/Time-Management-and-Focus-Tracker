import db from "../../config/db";
import redisClient from "../../config/redis";

// FocusSession interface definition
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
  const currentDate = new Date();

  try {
    const result = await db.query(
      "INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, $3) RETURNING *",
      [userId, duration, currentDate]
    );

    const cacheKeys = [
      `focus-metrics:${userId}:day`, // Invalidate daily metrics cache
      `focus-metrics:${userId}:week`, // Invalidate weekly metrics cache
    ];

    for (const key of cacheKeys) {
      await redisClient.del(key);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error inserting focus session:", error);
    throw error;
  }
};
