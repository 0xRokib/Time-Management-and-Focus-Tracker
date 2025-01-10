import { RequestHandler, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateFocusSession } from "../../middlewares/validateRequest";
import { logFocusSessionHandler } from "./focus.controller";

const focusRouter = Router();

focusRouter.post(
  "/focus-session",
  validateFocusSession as RequestHandler,
  authMiddleware as RequestHandler,
  // rateLimiter("focus:log") as RequestHandler,
  logFocusSessionHandler as RequestHandler
);

export default focusRouter;
