import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger";

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const httpLogger = morgan(format, { stream });

export default httpLogger;
