const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const config = {
  PORT: process.env.PORT || 5001,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONFIG: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
    connectionString: process.env.DB_CONNECTION_STRING || null,
  },
  REDIS_CONFIG: {
    url:
      process.env.REDIS_URL ||
      `redis://${process.env.REDIS_HOST || "localhost"}:${
        process.env.REDIS_PORT || 6379
      }`,
  },
};

module.exports = config;
