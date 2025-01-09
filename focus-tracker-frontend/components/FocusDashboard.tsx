"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useGetData } from "@/hooks/useApi";
import { motion } from "framer-motion";
import { Clock, Flame, Target } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FocusMetric {
  date: string;
  total_duration: number;
  total_sessions: number;
  week_name?: string;
  day_name?: string;
}

interface FocusMetricsResponse {
  message: string;
  data: {
    daily?: FocusMetric; // Daily data is a single object
    weekly?: FocusMetric[]; // Weekly data is an array of objects
  };
}

export function FocusDashboard() {
  const { user } = useAuth();
  const userId = user?.userId;

  // Constructing API URLs
  const dayUrl = `/api/metrics/focus-metrics?userId=${userId}&type=day`;
  const weekUrl = `/api/metrics/focus-metrics?userId=${userId}&type=week`;

  // Fetching daily and weekly data
  const { data: dayData, isPending: isDayLoading } =
    useGetData<FocusMetricsResponse>(dayUrl);
  const { data: weekData, isPending: isWeekLoading } =
    useGetData<FocusMetricsResponse>(weekUrl);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMotivationalMessage = (sessions: number) => {
    if (sessions === 0) return "Ready to start focusing?";
    if (sessions < 3) return "Great start! Keep going!";
    if (sessions < 5) return "You're on fire! 🔥";
    return "Incredible focus today! 🌟";
  };

  if (isDayLoading || isWeekLoading) {
    return <Card className="glass-card animate-pulse h-[400px]" />;
  }

  const dailyMetrics = {
    totalFocusTime: dayData?.data?.daily?.total_duration || 0,
    sessionsCompleted: dayData?.data?.daily?.total_sessions || 0,
  };

  const weeklyMetrics = {
    totalFocusTime: weekData?.data?.weekly?.reduce(
      (total: number, item: FocusMetric) => total + item.total_duration,
      0
    ),
    sessionsCompleted: weekData?.data?.weekly?.reduce(
      (total: number, item: FocusMetric) => total + item.total_sessions,
      0
    ),
    dailyBreakdown: (() => {
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const filledData = daysOfWeek.map((day) => {
        const existingData = weekData?.data?.weekly?.find(
          (item: FocusMetric) =>
            new Date(item.date).toLocaleDateString("en-US", {
              weekday: "short",
            }) === day
        );

        return {
          day,
          focusTime: existingData ? existingData.total_duration : 0, // If no data, set 0
        };
      });

      return filledData;
    })(),
  };

  // Debugging logs for checking the fetched data
  console.log("Day Data:", dayData);
  console.log("Week Data:", weekData);

  return (
    <div className="focus-dashboard-container w-full h-full text-white p-6 bg-[#101317]">
      {/* Header Section */}
      <div className="header-section flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#16C784] flex items-center gap-2">
            <Target className="h-6 w-6" /> Focus Dashboard
          </h1>
          <p className="text-lg font-semibold text-[#16C784] mt-2">
            {getMotivationalMessage(dailyMetrics.sessionsCompleted)}
          </p>
        </div>
      </div>

      {/* Daily Metrics Section */}
      <div className="daily-metrics grid grid-cols-2 gap-4 mb-8">
        <motion.div
          className="metric-card border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#16C784]" />
            <span className="text-sm text-gray-400">
              Total Focus Time (Daily)
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatTime(dailyMetrics.totalFocusTime)}
          </div>
        </motion.div>

        <motion.div
          className="metric-card border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#16C784]" />
            <span className="text-sm text-gray-400">
              Focus Sessions (Daily)
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {dailyMetrics.sessionsCompleted}
          </div>
        </motion.div>
      </div>

      {/* Weekly Metrics Section */}
      <div className="weekly-metrics border p-6 border-[#232B3A] bg-[#101317] rounded-xl">
        <h2 className="text-lg font-medium text-[#16C784] mb-4">
          Weekly Progress
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="metric-card border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#16C784]" />
              <span className="text-sm text-gray-400">
                Total Focus Time (Weekly)
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatTime(weeklyMetrics.totalFocusTime ?? 0)}
            </div>
          </motion.div>

          <motion.div
            className="metric-card border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#16C784]" />
              <span className="text-sm text-gray-400">
                Focus Sessions (Weekly)
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {weeklyMetrics.sessionsCompleted}
            </div>
          </motion.div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyMetrics.dailyBreakdown}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(147, 51, 234, 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.5)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 10, 31, 0.9)",
                  border: "1px solid rgba(147, 51, 234, 0.2)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="focusTime"
                fill="rgba(22, 199, 132, 0.6)"
                stroke="rgba(22, 199, 132, 1)"
                strokeWidth={2}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
