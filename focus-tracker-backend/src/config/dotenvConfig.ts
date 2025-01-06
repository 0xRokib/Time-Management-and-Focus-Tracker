const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5001,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONFIG: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  },
  REDIS_CONFIG: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  },
};
