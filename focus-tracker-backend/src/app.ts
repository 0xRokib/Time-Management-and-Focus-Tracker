import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

export default app;
