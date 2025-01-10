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
): Promise<{
  id: number;
  user_id: number;
  duration: number;
  timestamp: string;
}> => {
  const currentDate = new Date();

  const result = await db.query(
    "INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, $3) RETURNING *",
    [userId, duration, currentDate]
  );
  return result.rows[0];
};

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
// ): Promise<{
//   id: number;
//   user_id: number;
//   duration: number;
//   timestamp: string;
// }> => {
//   const currentDate = new Date();

//   // Generate a random number of days in the past or future (between -7 and 7 days)
//   const randomDays = Math.floor(Math.random() * 15) - 7;

//   // Calculate the new timestamp based on the random number of days
//   const randomTimestamp = new Date(currentDate);
//   randomTimestamp.setDate(currentDate.getDate() + randomDays); // Adds or subtracts days from the current date

//   const result = await db.query(
//     "INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, $3) RETURNING *",
//     [userId, duration, randomTimestamp]
//   );
//   return result.rows[0];
// };
