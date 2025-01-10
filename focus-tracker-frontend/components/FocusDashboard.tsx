"use client";
import { useFocusMetrics } from "@/hooks/useFocusMetrics";
import { useWeeklyFocusMetrics } from "@/hooks/useWeeklyFocusMetrics";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { Clock, Flame, Target } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { SkeletonCard } from "./SkeletonLoading";

import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  delay: number;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper Functions
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

// Reusable Metric Card Component
const MetricCard = ({ icon, title, value, delay }: MetricCardProps) => (
  <motion.div
    className="metric-card border p-5 border-[#232B3A] bg-[#101317] rounded-xl hover:shadow-xl "
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <span className="text-sm text-gray-400">{title}</span>
    </div>
    <div className="text-2xl font-bold text-white text-start">{value}</div>
  </motion.div>
);

export function FocusDashboard() {
  const { dailyMetrics, isDayLoading, dayError } = useFocusMetrics();
  const { weeklyMetrics, isWeekLoading, weekError } = useWeeklyFocusMetrics();

  if (dayError || weekError) {
    return (
      <div className="w-full h-full flex justify-center items-center text-white">
        <h2 className="text-xl font-semibold text-gray-400">
          Failed to load data. Please try again later.
        </h2>
      </div>
    );
  }

  if (isDayLoading || isWeekLoading) {
    return <SkeletonCard />;
  }

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
        <MetricCard
          icon={<Clock className="h-7 w-7 text-[#16C784]" />}
          title="Total Focus Time (Daily)"
          value={formatTime(dailyMetrics.totalFocusTime.toString())}
          delay={0.1}
        />
        <MetricCard
          icon={<Flame className="h-7 w-7 text-[#16C784]" />}
          title="Focus Sessions (Daily)"
          value={dailyMetrics.sessionsCompleted}
          delay={0.2}
        />
      </div>

      <div className="weekly-metrics border p-8 border-[#232B3A] bg-[#101317] rounded-xl shadow-xl">
        <h2 className="text-lg font-medium text-[#16C784] mb-6">
          Weekly Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <MetricCard
            icon={<Clock className="h-7 w-7 text-[#16C784]" />}
            title="Total Focus Time (Weekly)"
            value={formatTime(weeklyMetrics.totalFocusTime.toString())}
            delay={0.3}
          />
          <MetricCard
            icon={<Flame className="h-7 w-7 text-[#16C784]" />}
            title="Focus Sessions (Weekly)"
            value={weeklyMetrics.sessionsCompleted}
            delay={0.4}
          />
        </div>

        <div className="chart-container h-[400px] w-full mt-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
