import { FocusSession, logFocusSessionInDB } from "./focus.model";

export const logFocusSession = async (
  userId: number,
  duration: number
): Promise<FocusSession> => {
  if (duration <= 0) {
    throw new Error("Duration must be greater than 0");
  }

  try {
    const focusSession = await logFocusSessionInDB(userId, duration);

    return {
      id: focusSession.id,
      user_id: focusSession.user_id,
      duration: focusSession.duration,
      timestamp: new Date(focusSession.timestamp),
    };
  } catch (error) {
    console.error("Error logging focus session:", error);
    throw new Error("Failed to log focus session");
  }
};
