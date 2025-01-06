import { RequestHandler, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { rateLimiter } from "../../middlewares/rateLimitMiddleware";
import { getFocusMetricsHandler } from "./metricsComntroller";

const metricsRouter = Router();

metricsRouter.get(
  "/focus-metrics",
  authMiddleware as RequestHandler,
  rateLimiter("focus:metrics") as RequestHandler,
  getFocusMetricsHandler as RequestHandler
);

export default metricsRouter;
