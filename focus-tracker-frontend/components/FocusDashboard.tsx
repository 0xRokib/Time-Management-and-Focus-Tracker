"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useGetData } from "@/hooks/useApi";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { isSameDay, subHours } from "date-fns";
import { motion } from "framer-motion";
import { Clock, Flame, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { SkeletonCard } from "./SkeletonLoading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);

interface FocusMetric {
  date: string | null;
  total_duration: string;
  session_count: string;
}

interface FocusMetricsResponse {
  message: string;
  data: Record<string, FocusMetric>;
}

export function FocusDashboard() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [dayUrl, setDayUrl] = useState<string | null>(null);
  const [weekUrl, setWeekUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setDayUrl(`/api/metrics/focus-metrics?userId=${userId}&type=day`);
      setWeekUrl(`/api/metrics/focus-metrics?userId=${userId}&type=week`);
    }
  }, [userId]);

  const {
    data: dayData,
    isPending: isDayLoading,
    error: dayError,
  } = useGetData<FocusMetricsResponse>(dayUrl ?? "");
  const {
    data: weekData,
    isPending: isWeekLoading,
    error: weekError,
  } = useGetData<FocusMetricsResponse>(weekUrl ?? "");

  const formatTime = (minutes: string) => {
    const time = parseInt(minutes, 10);
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    return `${hours}h ${mins}m`;
  };

  const getMotivationalMessage = (sessions: number) => {
    if (sessions === 0) {
      return "Let's get started! Focus and crush it today! 💪 🚀";
    }
    if (sessions < 3) {
      return "You're off to a great start! Keep that momentum going! 🔥 💥";
    }
    if (sessions < 5) {
      return "You're on fire! Focus mode: ON 🔥 💪";
    }
    return "Incredible focus today! You're unstoppable! Keep it up! 🌟 🙌";
  };

  if (dayError || weekError) {
    return (
      <div className="w-full h-full flex justify-center items-center text-white">
        <h2 className="text-xl font-semibold text-gray-400">
          Failed to load data. Please try again later.
        </h2>
      </div>
    );
  }

  if (isDayLoading || isWeekLoading || !userId || !dayUrl || !weekUrl) {
    return <SkeletonCard />;
  }

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

  const chartData = {
    labels: weeklyMetrics.dailyBreakdown.map((item) => item.date),
    datasets: [
      {
        label: "Focus Time (minutes)",
        data: weeklyMetrics.dailyBreakdown.map((item) => item.totalFocusTime),
        backgroundColor: "#16C784",
        borderColor: "#16C784",
        borderWidth: 2,
        barThickness: 40,
        borderRadius: 8,
        hoverBackgroundColor: "#00C7A7",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
      y: {
        grid: { color: "#232B3A" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="focus-dashboard-container w-full min-h-screen text-white p-4 bg-[#101317]">
      <div className="header-section flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#16C784] flex items-center gap-2">
            <Target className="h-8 w-8" /> Focus Dashboard
          </h1>
          <p className="text-lg font-semibold text-[#16C784] mt-3">
            {getMotivationalMessage(dailyMetrics.sessionsCompleted)}
          </p>
        </div>
      </div>

      <div className="daily-metrics grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div
          className="metric-card border p-5 border-[#232B3A] bg-[#101317] rounded-xl hover:shadow-xl "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-7 w-7 text-[#16C784]" />
            <span className="text-sm text-gray-400">
              Total Focus Time (Daily)
            </span>
          </div>
          <div className="text-2xl font-bold text-white text-start">
            {formatTime(dailyMetrics.totalFocusTime.toString())}
          </div>
        </motion.div>

        <motion.div
          className="metric-card border p-5 border-[#232B3A] bg-[#101317] rounded-xl hover:shadow-xl "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Flame className="h-7 w-7 text-[#16C784]" />
            <span className="text-sm text-gray-400">
              Focus Sessions (Daily)
            </span>
          </div>
          <div className="text-2xl font-bold text-white text-start">
            {dailyMetrics.sessionsCompleted}
          </div>
        </motion.div>
      </div>

      <div className="weekly-metrics border p-8 border-[#232B3A] bg-[#101317] rounded-xl shadow-xl">
        <h2 className="text-lg font-medium text-[#16C784] mb-6">
          Weekly Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <motion.div
            className="metric-card border p-5 border-[#232B3A] bg-[#101317] rounded-xl hover:shadow-xl "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-7 w-7 text-[#16C784]" />
              <span className="text-sm text-gray-400">
                Total Focus Time (Weekly)
              </span>
            </div>
            <div className="text-2xl font-bold text-white text-start">
              {formatTime(weeklyMetrics.totalFocusTime.toString())}
            </div>
          </motion.div>

          <motion.div
            className="metric-card border p-5 border-[#232B3A] bg-[#101317] rounded-xl hover:shadow-xl "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Flame className="h-7 w-7 text-[#16C784]" />
              <span className="text-sm text-gray-400">
                Focus Sessions (Weekly)
              </span>
            </div>
            <div className="text-2xl font-bold text-white text-start">
              {weeklyMetrics.sessionsCompleted}
            </div>
          </motion.div>
        </div>

        <div className="chart-container h-[400px] w-full mt-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
