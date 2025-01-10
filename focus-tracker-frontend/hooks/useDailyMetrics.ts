import { useEffect, useState } from "react";

interface FocusMetrics {
  totalFocusTime: number;
  sessionsCompleted: number;
}

interface FocusMetricsResponse {
  message: string;
  data: Record<
    string,
    { total_duration: string; session_count: string; date: string }
  >;
}

export function useDailyMetrics(userId: number | undefined) {
  const [dailyMetrics, setDailyMetrics] = useState<FocusMetrics>({
    totalFocusTime: 0,
    sessionsCompleted: 0,
  });
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(
          `/api/metrics/focus-metrics?userId=${userId}&type=day`
        );
        const data: FocusMetricsResponse = await response.json();

        // Calculate today's metrics
        const today = new Date();
        const dailyFocusTime = Object.values(data.data).reduce(
          (total, metric) => {
            const metricDate = new Date(metric.date);
            if (
              metricDate.getUTCFullYear() === today.getUTCFullYear() &&
              metricDate.getUTCMonth() === today.getUTCMonth() &&
              metricDate.getUTCDate() === today.getUTCDate()
            ) {
              return total + parseInt(metric.total_duration, 10);
            }
            return total;
          },
          0
        );

        const dailySessionsCompleted = Object.values(data.data).reduce(
          (total, metric) => {
            const metricDate = new Date(metric.date);
            if (
              metricDate.getUTCFullYear() === today.getUTCFullYear() &&
              metricDate.getUTCMonth() === today.getUTCMonth() &&
              metricDate.getUTCDate() === today.getUTCDate()
            ) {
              return total + parseInt(metric.session_count, 10);
            }
            return total;
          },
          0
        );

        setDailyMetrics({
          totalFocusTime: dailyFocusTime,
          sessionsCompleted: dailySessionsCompleted,
        });
      } catch (error) {
        console.error("Error fetching daily metrics", error);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [userId]);

  return { dailyMetrics, isPending };
}
