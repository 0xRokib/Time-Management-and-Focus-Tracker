import { MetricType } from "../../types/customType";
import {
  FocusMetric,
  getDailyMetricsFromDB,
  getWeeklyMetricsFromDB,
} from "./metrics.model";

export const getFocusMetrics = async (
  userId: number,
  metricType: MetricType
): Promise<{ [key: string]: FocusMetric }> => {
  let metrics: { [key: string]: FocusMetric };

  if (metricType === "day") {
    metrics = await getDailyMetricsFromDB(userId);
  } else {
    metrics = await getWeeklyMetricsFromDB(userId);
  }

  return metrics;
};
