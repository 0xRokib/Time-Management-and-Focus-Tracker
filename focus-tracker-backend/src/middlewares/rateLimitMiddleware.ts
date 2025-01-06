import { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis";

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const MAX_REQUESTS = 10; // Maximum 10 requests per window

export const rateLimiter =
  (routeKey: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userKey = `${routeKey}:${req.ip}`;
      const requests = await redisClient.incr(userKey);

      if (requests === 1) {
        await redisClient.expire(userKey, RATE_LIMIT_WINDOW);
      }

      if (requests > MAX_REQUESTS) {
        return res
          .status(429)
          .send("Too many requests. Please try again later.");
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next(err);
      res.status(500).send("Internal server error");
    }
  };
