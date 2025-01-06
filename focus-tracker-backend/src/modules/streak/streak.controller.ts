import { Request, Response } from "express";
import { getStreak } from "./streak.service";

export const getStreakHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { currentStreak, longestStreak, badge } = await getStreak(
      parseInt(userId as string)
    );

    res.status(200).json({
      message: "Streak data fetched successfully",
      data: { currentStreak, longestStreak, badge },
    });
  } catch (err) {
    console.error("Error fetching streak data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
