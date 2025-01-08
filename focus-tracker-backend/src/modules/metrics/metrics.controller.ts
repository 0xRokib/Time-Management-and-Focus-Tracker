import { Request, Response } from "express";

import { MetricType } from "../../types/customType";
import { getFocusMetrics } from "./metrics.service";

export const getFocusMetricsHandler = async (req: Request, res: Response) => {
  try {
    const { userId, type: metricType } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!["day", "week"].includes(metricType as string)) {
      return res
        .status(400)
        .json({ error: 'Invalid metricType. Use "day" or "week".' });
    }
    const metrics = await getFocusMetrics(
      parseInt(userId as string, 10),
      metricType as MetricType
    );

    res
      .status(200)
      .json({ message: "Metrics fetched successfully", data: metrics });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
