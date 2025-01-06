import { RequestHandler, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { rateLimiter } from "../../middlewares/rateLimitMiddleware";
import { getStreakHandler } from "./streak.controller";

const streakRouter = Router();

streakRouter.get(
  "/streak",
  authMiddleware as RequestHandler,
  rateLimiter("streaks") as RequestHandler,
  getStreakHandler as RequestHandler
);

export default streakRouter;
