import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route";
import focusRouter from "./modules/focus/focus.route";

import metricsRouter from "./modules/metrics/metrics.route";
import { errorHandler } from "./utils/errorHandler";
import httpLogger from "./utils/httpLogger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(httpLogger);

app.use("/api/auth", authRouter);
app.use("/api/focus", focusRouter);
app.use("/api/metrics", metricsRouter);

// error handler
app.use(errorHandler);

export default app;
