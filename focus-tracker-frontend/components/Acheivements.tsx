"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Flame, Star, Target, Trophy } from "lucide-react";

const achievements = [
  {
    name: "Early Bird",
    description: "Complete 5 focus sessions before noon",
    progress: 80,
    icon: Star,
  },
  {
    name: "Night Owl",
    description: "Complete 3 focus sessions after 8 PM",
    progress: 60,
    icon: Trophy,
  },
  {
    name: "Weekend Warrior",
    description: "Maintain focus sessions on weekends",
    progress: 45,
    icon: Target,
  },
  {
    name: "Streak Master",
    description: "Maintain a 10-day focus streak",
    progress: 70,
    icon: Flame,
  },
];

const staticStreakData = {
  currentStreak: 7,
  longestStreak: 15,
  badges: ["Consistency Champ", "Focus Master", "Goal Crusher"],
  streakProgress: 70,
};

export default function AchievementsPage() {
  const streakData = staticStreakData;

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
            <Progress value={streakData.streakProgress} className="h-2 mt-2" />
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
              {streakData.badges.length}
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
            {streakData.badges.map((badge, index) => (
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
            ))}
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
                  <div className="text-sm text-gray-400">
                    {achievement.progress}%
                  </div>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
