import { NextFunction, Request, Response } from "express";
import getRedisClient from "../config/redis";

const RATE_LIMIT_WINDOW = 600; // 10 minutes
const MAX_REQUESTS = 20;

// In-memory rate limiting for production
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter =
  (routeKey: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userKey = `${routeKey}:${req.ip}`;
      const now = Date.now();

      // Try Redis first if available
      if (process.env.NODE_ENV !== "production" || process.env.IS_LOCAL) {
        try {
          const redisClient = await getRedisClient();
          const requests = await redisClient.incr(userKey);
          if (requests === 1) {
            await redisClient.expire(userKey, RATE_LIMIT_WINDOW);
          }
          if (requests > MAX_REQUESTS) {
            return res
              .status(429)
              .send("Too many requests. Please try again later.");
          }
        } catch (redisError) {
          console.error("Redis rate limiter error:", redisError);
          // Fall through to in-memory rate limiting if Redis fails
        }
      }

      // Fallback to in-memory rate limiting
      const userData = requestCounts.get(userKey);
      if (!userData || now >= userData.resetTime) {
        requestCounts.set(userKey, {
          count: 1,
          resetTime: now + RATE_LIMIT_WINDOW * 1000,
        });
      } else {
        userData.count++;
        if (userData.count > MAX_REQUESTS) {
          return res
            .status(429)
            .send("Too many requests. Please try again later.");
        }
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      // Allow the request to proceed if rate limiting fails
      next();
    }
  };
