import { useAuth } from "@/app/context/AuthContext";
import { useGetData } from "@/hooks/useApi";
import { isSameDay } from "date-fns";
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
    refetch: refetchDayData,
  } = useGetData<FocusMetricsResponse>(dayUrl ?? "");

  const today = new Date();

  useEffect(() => {
    if (dayData) {
      refetchDayData();
    }
  }, [dayData, refetchDayData]);

  const dailyMetrics = {
    totalFocusTime: Object.entries(dayData?.data || {})
      .filter(([key]) => {
        const metricDate = new Date(key);
        metricDate.setHours(metricDate.getHours() + 6);
        return isSameDay(metricDate, today);
      })
      .reduce(
        (total, [, metric]) => total + parseInt(metric.total_duration, 10),
        0
      ),

    sessionsCompleted: Object.entries(dayData?.data || {})
      .filter(([key]) => {
        const metricDate = new Date(key);
        metricDate.setHours(metricDate.getHours() + 6);
        return isSameDay(metricDate, today);
      })
      .reduce(
        (total, [, metric]) => total + parseInt(metric.session_count, 10),
        0
      ),
  };

  return { dailyMetrics, isDayLoading, dayError };
}
