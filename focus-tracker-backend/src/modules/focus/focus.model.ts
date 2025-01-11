// import db from "../../config/db";

// export interface FocusSession {
//   id: number;
//   user_id: number;
//   duration: number;
//   timestamp: Date;
// }

// export const logFocusSessionInDB = async (
//   userId: number,
//   duration: number
// ): Promise<FocusSession> => {
//   const currentDate = new Date();

//   // Insert the first session with today's date
//   const sessionTimestamp = new Date(currentDate);

//   // Insert the first session
//   const result = await db.query(
//     "INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, $3) RETURNING *",
//     [userId, duration, sessionTimestamp]
//   );

//   const insertedFocusSession = result.rows[0];

//   // Insert next 6 sessions, each with a 1-day increment (total of 7 days)
//   for (let i = 1; i < 7; i++) {
//     sessionTimestamp.setDate(currentDate.getDate() + i); // Adds 1 day for each session
//     await db.query(
//       "INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, $3) RETURNING *",
//       [userId, duration, sessionTimestamp]
//     );
//   }

//   // Return the first inserted session (for consistency with logFocusSession)
//   return {
//     id: insertedFocusSession.id,
//     user_id: insertedFocusSession.user_id,
//     duration: insertedFocusSession.duration,
//     timestamp: insertedFocusSession.timestamp,
//   };
// };

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
