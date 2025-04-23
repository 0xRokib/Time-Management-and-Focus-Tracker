import db from "../../config/db";
import getRedisClient from "../../config/redis";

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

    try {
      const redisClient = await getRedisClient();
      for (const key of cacheKeys) {
        await redisClient.del(key);
      }
    } catch (redisError) {
      console.error("Error clearing Redis cache:", redisError);
      // Continue even if cache clearing fails
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error inserting focus session:", error);
    throw error;
  }
};
