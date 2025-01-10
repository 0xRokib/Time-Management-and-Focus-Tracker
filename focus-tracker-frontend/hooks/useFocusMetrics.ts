// useFocusMetrics.ts (Custom Hook for Daily Metrics)
import { useAuth } from "@/app/context/AuthContext";
import { useGetData } from "@/hooks/useApi";
import { isSameDay, subHours } from "date-fns";
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

export function useFocusMetrics() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [dayUrl, setDayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setDayUrl(`/api/metrics/focus-metrics?userId=${userId}&type=day`);
    }
  }, [userId]);

  const {
    data: dayData,
    isPending: isDayLoading,
    error: dayError,
  } = useGetData<FocusMetricsResponse>(dayUrl ?? "");

  const today = new Date();

  const dailyMetrics = {
    totalFocusTime: Object.entries(dayData?.data || {})
      .filter(([key]) => {
        const metricDate = subHours(new Date(key), 6);
        return isSameDay(metricDate, today);
      })
      .reduce(
        (total, [, metric]) => total + parseInt(metric.total_duration, 10),
        0
      ),

    sessionsCompleted: Object.entries(dayData?.data || {})
      .filter(([key]) => {
        const metricDate = subHours(new Date(key), 6);
        return isSameDay(metricDate, today);
      })
      .reduce(
        (total, [, metric]) => total + parseInt(metric.session_count, 10),
        0
      ),
  };

  return { dailyMetrics, isDayLoading, dayError };
}
