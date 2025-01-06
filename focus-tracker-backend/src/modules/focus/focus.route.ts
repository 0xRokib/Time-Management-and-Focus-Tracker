import { RequestHandler, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { rateLimiter } from "../../middlewares/rateLimitMiddleware";
import { logFocusSessionHandler } from "./focus.controller";

const focusRouter = Router();

focusRouter.post(
  "/focus-session",
  authMiddleware as RequestHandler,
  rateLimiter("focus:log") as RequestHandler,
  logFocusSessionHandler as RequestHandler
);

export default focusRouter;
