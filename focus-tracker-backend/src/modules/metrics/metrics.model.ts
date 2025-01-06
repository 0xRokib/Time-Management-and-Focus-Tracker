import db from "../../config/db";

export interface FocusMetric {
  date: string;
  total_duration: number;
}

export const getDailyMetricsFromDB = async (
  userId: number
): Promise<FocusMetric[]> => {
  const result = await db.query(
    `SELECT 
        DATE(timestamp) AS date, 
        SUM(duration) AS total_duration 
     FROM focus_sessions 
     WHERE user_id = $1 
     GROUP BY DATE(timestamp) 
     ORDER BY DATE(timestamp) DESC`,
    [userId]
  );
  return result.rows;
};

export const getWeeklyMetricsFromDB = async (
  userId: number
): Promise<FocusMetric[]> => {
  const result = await db.query(
    `SELECT 
        DATE_TRUNC('week', timestamp) AS date, 
        SUM(duration) AS total_duration 
     FROM focus_sessions 
     WHERE user_id = $1 
     GROUP BY DATE_TRUNC('week', timestamp) 
     ORDER BY DATE_TRUNC('week', timestamp) DESC`,
    [userId]
  );
  return result.rows;
};
