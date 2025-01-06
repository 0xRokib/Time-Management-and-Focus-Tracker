import { findUserById } from "../../utils/findUserUtils";
import { FocusSession, logFocusSessionInDB } from "./focus.model";

export const logFocusSession = async (
  userId: number,
  duration: number
): Promise<FocusSession> => {
  if (duration <= 0) {
    throw new Error("Duration must be greater than 0");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await logFocusSessionInDB(userId, duration);
};
