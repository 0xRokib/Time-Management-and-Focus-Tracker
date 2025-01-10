import db from "../../config/db";

export interface FocusMetric {
  date: string;
  total_duration: number;
  session_count: number;
}

export const getDailyMetricsFromDB = async (
  userId: number
): Promise<{ [key: string]: FocusMetric }> => {
  const result = await db.query(
    `
    SELECT 
        DATE(timestamp AT TIME ZONE '+06') AS date,
        SUM(duration) AS total_duration,
        COUNT(*) AS session_count
    FROM focus_sessions
    WHERE user_id = $1 AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(timestamp AT TIME ZONE '+06')
    ORDER BY date DESC;
    `,
    [userId]
  );

  if (!Array.isArray(result.rows)) {
    throw new Error("Expected result.rows to be an array");
  }

  return result.rows.length > 0
    ? result.rows.reduce((acc: { [key: string]: FocusMetric }, row: any) => {
        acc[row.date] = {
          date: row.date,
          total_duration: row.total_duration,
          session_count: row.session_count,
        };
        return acc;
      }, {})
    : {};
};

export const getWeeklyMetricsFromDB = async (
  userId: number
): Promise<{ [key: string]: FocusMetric }> => {
  const result = await db.query(
    `
    SELECT 
        DATE(timestamp AT TIME ZONE '+06') AS date,
        SUM(duration) AS total_duration,
        COUNT(*) AS session_count
    FROM focus_sessions
    WHERE user_id = $1 AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY DATE(timestamp AT TIME ZONE '+06')
    ORDER BY date DESC;
    `,
    [userId]
  );

  if (!Array.isArray(result.rows)) {
    throw new Error("Expected result.rows to be an array");
  }

  return result.rows.length > 0
    ? result.rows.reduce((acc: { [key: string]: FocusMetric }, row: any) => {
        acc[row.date] = {
          date: row.date,
          total_duration: row.total_duration,
          session_count: row.session_count,
        };
        return acc;
      }, {})
    : {};
};
