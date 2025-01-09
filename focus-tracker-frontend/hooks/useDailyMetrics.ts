import { useGetData } from "@/hooks/useApi";

interface FocusMetric {
  date: string;
  total_duration: number;
  total_sessions: number;
}

interface FocusMetricsResponse {
  message: string;
  data: {
    daily?: FocusMetric;
  };
}

export function useDailyMetrics(userId: number | undefined) {
  const dayUrl = userId
    ? `/api/metrics/focus-metrics?userId=${userId}&type=day`
    : "";
  const { data, isPending } = useGetData<FocusMetricsResponse>(dayUrl);

  const dailyMetrics = data?.data?.daily
    ? {
        totalFocusTime: data?.data?.daily?.total_duration || 0,
        sessionsCompleted: data?.data?.daily?.total_sessions || 0,
      }
    : {
        totalFocusTime: 0,
        sessionsCompleted: 0,
      };

  return {
    dailyMetrics,
    isPending,
  };
}
