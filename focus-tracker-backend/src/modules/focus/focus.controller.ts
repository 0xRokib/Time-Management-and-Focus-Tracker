import { Request, Response } from "express";

import { findUserById } from "../../utils/findUserUtils";
import logger from "../../utils/logger";
import { logFocusSession } from "./focus.service";

export const logFocusSessionHandler = async (req: Request, res: Response) => {
  try {
    const { userId, duration } = req.body;

    if (!userId || !duration) {
      return res
        .status(400)
        .json({ error: "User ID and duration are required" });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const focusSession = await logFocusSession(userId, duration);

    logger.info(`Focus session logged for user ${userId}: ${duration} minutes`);

    res.status(201).json({
      message: "Focus session logged successfully",
      data: focusSession,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
