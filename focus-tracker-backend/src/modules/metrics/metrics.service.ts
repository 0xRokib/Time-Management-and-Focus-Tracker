import redisClient from "../../config/redis";
import { MetricType } from "../../types/customType";

import {
  FocusMetric,
  getDailyMetricsFromDB,
  getWeeklyMetricsFromDB,
} from "./metrics.model";

const CACHE_EXPIRY = 60 * 60; // Cache expiry time in seconds (1 hour)

export const getFocusMetrics = async (
  userId: number,
  metricType: MetricType
): Promise<FocusMetric[]> => {
  const cacheKey = `focus-metrics:${userId}:${metricType}`;
  const cachedMetrics = await redisClient.get(cacheKey);

  if (cachedMetrics) {
    console.log("Returning metrics from cache");
    return JSON.parse(cachedMetrics);
  }

  // Fetch metrics from the database based on type
  let metrics: FocusMetric[];
  if (metricType === "day") {
    metrics = await getDailyMetricsFromDB(userId);
  } else {
    metrics = await getWeeklyMetricsFromDB(userId);
  }

  // Cache the result for future requests
  await redisClient.set(cacheKey, JSON.stringify(metrics), {
    EX: CACHE_EXPIRY,
  });

  return metrics;
};
