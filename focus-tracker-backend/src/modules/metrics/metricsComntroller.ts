import { Request, Response } from "express";
import { getFocusMetrics } from "./metricsService";

export const getFocusMetricsHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { type } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!["day", "week"].includes(type as string)) {
      return res
        .status(400)
        .json({ error: 'Invalid type. Use "day" or "week".' });
    }

    const metrics = await getFocusMetrics(userId, type as "day" | "week");
    res
      .status(200)
      .json({ message: "Metrics fetched successfully", data: metrics });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
