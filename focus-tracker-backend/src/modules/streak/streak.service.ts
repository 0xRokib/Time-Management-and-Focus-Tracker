import redisClient from "../../config/redis";
import { getFocusSessionsFromDB } from "./streak.model";

const CACHE_EXPIRY = 60 * 60; // 1 hour cache expiry

export const getStreak = async (
  userId: number
): Promise<{
  currentStreak: number;
  longestStreak: number;
  badge: string | null;
}> => {
  const cacheKey = `streak:${userId}`;
  const cachedStreak = await redisClient.get(cacheKey);

  if (cachedStreak) {
    console.log("Returning streak data from cache");
    return JSON.parse(cachedStreak);
  }

  // Fetch all focus sessions from the database
  const focusSessions = await getFocusSessionsFromDB(userId);

  if (focusSessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, badge: null };
  }

  let currentStreak = 1;
  let longestStreak = 1;

  let previousSessionDate = new Date(focusSessions[0].timestamp);
  let tempCurrentStreak = 1;

  // Loop through the focus sessions and calculate streaks
  for (let i = 1; i < focusSessions.length; i++) {
    const currentSessionDate = new Date(focusSessions[i].timestamp);

    const differenceInTime =
      currentSessionDate.getTime() - previousSessionDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Difference in days

    if (differenceInDays === 1) {
      tempCurrentStreak++; // Consecutive day streak
    } else if (differenceInDays > 1) {
      // Reset streak if the user skipped days
      tempCurrentStreak = 1;
    }

    // Track the longest streak
    if (tempCurrentStreak > longestStreak) {
      longestStreak = tempCurrentStreak;
    }

    previousSessionDate = currentSessionDate;
  }

  currentStreak = tempCurrentStreak; // Set final current streak value

  // Award badge based on the longest streak
  const badge = awardBadge(longestStreak);

  // Cache the streak data
  await redisClient.set(
    cacheKey,
    JSON.stringify({ currentStreak, longestStreak, badge }),
    { EX: CACHE_EXPIRY }
  );

  return { currentStreak, longestStreak, badge };
};

// Badge award logic based on longest streak
export const awardBadge = (streakLength: number): string | null => {
  if (streakLength >= 100) return "Gold Badge";
  if (streakLength >= 30) return "Silver Badge";
  if (streakLength >= 7) return "Bronze Badge";
  return null;
};
