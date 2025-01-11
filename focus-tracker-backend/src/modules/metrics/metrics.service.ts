import redisClient from "../../config/redis";
import { MetricType } from "../../types/customType";
import {
  FocusMetric,
  getDailyMetricsFromDB,
  getWeeklyMetricsFromDB,
} from "./metrics.model";

const CACHE_TTL_SECONDS = 3600; // 1 hour

export const getFocusMetrics = async (
  userId: number,
  metricType: MetricType
): Promise<{ [key: string]: FocusMetric }> => {
  const cacheKey = `focus-metrics:${userId}:${metricType}`;
  let metrics: { [key: string]: FocusMetric };

  try {
    const cachedMetrics = await redisClient.get(cacheKey);

    if (cachedMetrics) {
      metrics = JSON.parse(cachedMetrics);
      console.log("Data fetched from cache");
    } else {
      metrics =
        metricType === "day"
          ? await getDailyMetricsFromDB(userId)
          : await getWeeklyMetricsFromDB(userId);

      await redisClient.setEx(
        cacheKey,
        CACHE_TTL_SECONDS,
        JSON.stringify(metrics)
      );
      console.log("Data fetched from database and cached");
    }

    return metrics;
  } catch (error) {
    console.error("Error fetching metrics with Redis:", error);
    throw error;
  }
};
