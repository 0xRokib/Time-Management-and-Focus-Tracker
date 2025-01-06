import redisClient from "../../config/redis";
import {
  FocusMetric,
  getDailyMetricsFromDB,
  getWeeklyMetricsFromDB,
} from "./metricsModel";

const CACHE_EXPIRY = 60 * 60; // Cache expiry time in seconds (1 hour)

export const getFocusMetrics = async (
  userId: number,
  type: "day" | "week"
): Promise<FocusMetric[]> => {
  const cacheKey = `focus-metrics:${userId}:${type}`;
  const cachedMetrics = await redisClient.get(cacheKey);
  //   if (cachedMetrics) {
  //     console.log("Returning metrics from cache");
  //   } else {
  //     console.log("Fetching metrics from database");
  //   }

  if (cachedMetrics) {
    console.log("Returning metrics from cache");
    return JSON.parse(cachedMetrics);
  }

  // Fetch metrics from the database based on type
  let metrics: FocusMetric[];
  if (type === "day") {
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
