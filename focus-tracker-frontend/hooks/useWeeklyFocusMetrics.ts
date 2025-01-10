// useWeeklyFocusMetrics.ts (Custom Hook for Weekly Metrics)
import { useAuth } from "@/app/context/AuthContext";
import { useGetData } from "@/hooks/useApi";
import { subHours } from "date-fns";
import { useEffect, useState } from "react";

interface FocusMetric {
  date: string | null;
  total_duration: string;
  session_count: string;
}

interface FocusMetricsResponse {
  message: string;
  data: Record<string, FocusMetric>;
}

export function useWeeklyFocusMetrics() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [weekUrl, setWeekUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setWeekUrl(`/api/metrics/focus-metrics?userId=${userId}&type=week`);
    }
  }, [userId]);

  const {
    data: weekData,
    isPending: isWeekLoading,
    error: weekError,
  } = useGetData<FocusMetricsResponse>(weekUrl ?? "");

  const weeklyMetrics = {
    totalFocusTime: Object.values(weekData?.data || {}).reduce(
      (total, metric) => total + parseInt(metric.total_duration, 10),
      0
    ),
    sessionsCompleted: Object.values(weekData?.data || {}).reduce(
      (total, metric) => total + parseInt(metric.session_count, 10),
      0
    ),
    dailyBreakdown: Object.values(weekData?.data || {}).map((metric) => {
      const metricDate = subHours(new Date(metric.date!), 6);
      return {
        date: metricDate.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        }),
        dayName: metricDate.toLocaleString("en-US", {
          weekday: "short",
        }),
        totalFocusTime: parseInt(metric.total_duration, 10),
        totalSessions: parseInt(metric.session_count, 10),
      };
    }),
  };

  return { weeklyMetrics, isWeekLoading, weekError };
}
