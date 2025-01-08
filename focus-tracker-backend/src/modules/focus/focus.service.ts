import redisClient from "../../config/redis";
import { FocusSession, logFocusSessionInDB } from "./focus.model";

export const logFocusSession = async (
  userId: number,
  duration: number
): Promise<FocusSession> => {
  if (duration <= 0) throw new Error("Duration must be greater than 0");

  const focusSession = await logFocusSessionInDB(userId, duration);

  await redisClient.del(`focus-metrics:${userId}:day`);
  await redisClient.del(`focus-metrics:${userId}:week`);

  return focusSession;
};
