"use client";

import { useAuth } from "@/app/context/AuthContext"; // Assuming the context provides user data
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetData } from "@/hooks/useApi"; // Assuming you are using a hook for API fetching
import { motion } from "framer-motion";
import { Flame, Star, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { SkeletonCard } from "./SkeletonLoading";

interface FocusMetricsResponse {
  message: string;
  data: Record<string, { total_duration: string; session_count: string }>;
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setApiUrl(`/api/metrics/focus-metrics?userId=${userId}&type=week`);
    }
  }, [userId]);

  // Call the hook
  const {
    data: weekData,
    isPending,
    error,
  } = useGetData<FocusMetricsResponse>(apiUrl || "");

  if (!userId) {
    return (
      <div className="w-full h-full flex justify-center items-center text-white">
        <h2 className="text-xl font-semibold text-gray-400">
          User not authenticated. Please log in.
        </h2>
      </div>
    );
  }

  if (isPending) return <SkeletonCard />;
  if (error || !weekData) {
    return (
      <div className="w-full h-full flex justify-center items-center text-white">
        <h2 className="text-xl font-semibold text-gray-400">
          Failed to load data. Please try again later.
        </h2>
      </div>
    );
  }

  // Helper function to calculate the streaks
  const calculateStreak = (
    data: Record<string, { total_duration: string; session_count: string }>
  ) => {
    if (Object.keys(data).length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    const sortedDates = Object.keys(data)
      .map((key) => new Date(key))
      .sort((a, b) => a.getTime() - b.getTime());

    let currentStreak = 1;
    let longestStreak = 1;
    let previousDate = sortedDates[0];
    const today = new Date();

    for (let i = 1; i < sortedDates.length; i++) {
      const diffInDays =
        (sortedDates[i].getTime() - previousDate.getTime()) /
        (1000 * 3600 * 24);

      if (diffInDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }

      if (isSameDay(sortedDates[i], today)) {
        currentStreak = Math.max(currentStreak, currentStreak);
      }

      previousDate = sortedDates[i];
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return {
      currentStreak,
      longestStreak,
    };
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Calculate streak data from the API response
  const streakData = calculateStreak(weekData.data);

  // Dynamically calculate badges based on streak
  const calculateBadges = (streakData: { currentStreak: number }) => {
    const badges = [];

    // Badge calculation for 1, 3, 5, 7 days streaks
    if (streakData.currentStreak >= 1) badges.push("Focus Initiate"); // Completing your first streak
    if (streakData.currentStreak >= 3) badges.push("Focus Builder"); // Starting to build your streak
    if (streakData.currentStreak >= 5) badges.push("Consistency Expert"); // Showing consistent effort
    if (streakData.currentStreak >= 7) badges.push("Focus Master"); // Mastering focus with a 7-day streak

    return badges;
  };

  const badges = calculateBadges(streakData);

  // Helper function to calculate individual badge progress
  const badgeProgress = (badge: string, currentStreak: number) => {
    let progress = 0;

    switch (badge) {
      case "Focus Initiate":
        progress = currentStreak >= 1 ? 100 : 0;
        break;
      case "Focus Builder":
        progress = currentStreak >= 3 ? 100 : (currentStreak / 3) * 100;
        break;
      case "Consistency Expert":
        progress = currentStreak >= 5 ? 100 : (currentStreak / 5) * 100;
        break;
      case "Focus Master":
        progress = currentStreak >= 7 ? 100 : (currentStreak / 7) * 100;
        break;
      default:
        break;
    }

    return Math.round(progress);
  };

  // Calculate achievements with dynamic progress
  const achievements = [
    {
      name: "Focus Initiate",
      description:
        "Complete your first streak and begin your journey towards building focus habits.",
      progress: badgeProgress("Focus Initiate", streakData.currentStreak),
      icon: Star,
    },
    {
      name: "Focus Builder",
      description:
        "Build on your streak by maintaining focus for 3 consecutive days.",
      progress: badgeProgress("Focus Builder", streakData.currentStreak),
      icon: Trophy,
    },
    {
      name: "Consistency Expert",
      description:
        "Demonstrate your consistency by achieving a 5-day streak and staying focused over time.",
      progress: badgeProgress("Consistency Expert", streakData.currentStreak),
      icon: Target,
    },
    {
      name: "Focus Master",
      description:
        "Achieve a 7-day focus streak, proving your mastery in maintaining focus consistently.",
      progress: badgeProgress("Focus Master", streakData.currentStreak),
      icon: Flame,
    },
  ];

  return (
    <div className="w-full min-h-screen text-white p-4 bg-[#101317] space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          className="border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#16C784]">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {streakData.currentStreak} days
              <Flame className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </motion.div>

        <motion.div
          className="border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#16C784]">
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {streakData.longestStreak} days
            </div>
          </CardContent>
        </motion.div>

        <motion.div
          className="border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#16C784]">
              Total Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {badges.length > 0 ? badges.length : 0}
            </div>
          </CardContent>
        </motion.div>
      </div>

      <motion.div
        className="border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CardHeader>
          <CardTitle className="text-[#16C784]">Badges Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-[#232B3A] px-4 py-2 rounded-full text-white"
                >
                  <Trophy className="h-4 w-4 text-[#16C784]" />
                  <span>{badge}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-white">No badges earned yet.</p>
            )}
          </div>
        </CardContent>
      </motion.div>

      <motion.div
        className="border p-4 border-[#232B3A] bg-[#101317] rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CardHeader>
          <CardTitle className="text-[#16C784]">
            Achievements Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <achievement.icon className="h-5 w-5 text-[#16C784]" />
                    <div>
                      <div className="font-medium text-white">
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    {achievement.progress}%
                  </div>
                </div>
                <div className="h-2 bg-[#e0e0e0] w-full rounded-full">
                  <div
                    className="h-2 bg-[#16C784] rounded-full"
                    style={{
                      width: `${achievement.progress}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
