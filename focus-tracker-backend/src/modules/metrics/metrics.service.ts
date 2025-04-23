import getRedisClient from "../../config/redis";
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
    // Try to get from Redis cache first
    try {
      const redisClient = await getRedisClient();
      const cachedMetrics = await redisClient.get(cacheKey);
      if (cachedMetrics) {
        return JSON.parse(cachedMetrics);
      }
    } catch (redisError) {
      console.error("Redis cache error (non-fatal):", redisError);
      // Continue to database fetch if Redis fails
    }

    // Fetch from database
    metrics =
      metricType === "day"
        ? await getDailyMetricsFromDB(userId)
        : await getWeeklyMetricsFromDB(userId);

    // Try to cache the result, but don't fail if it doesn't work
    try {
      const redisClient = await getRedisClient();
      await redisClient.setEx(
        cacheKey,
        CACHE_TTL_SECONDS,
        JSON.stringify(metrics)
      );
    } catch (cacheError) {
      console.error("Error caching metrics (non-fatal):", cacheError);
    }

    return metrics;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};
