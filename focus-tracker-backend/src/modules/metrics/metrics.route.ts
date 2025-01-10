import { RequestHandler, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getFocusMetricsHandler } from "./metrics.controller";

const metricsRouter = Router();

metricsRouter.get(
  "/focus-metrics",
  authMiddleware as RequestHandler,
  getFocusMetricsHandler as RequestHandler
);

export default metricsRouter;
