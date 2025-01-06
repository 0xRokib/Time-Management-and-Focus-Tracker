import { Pool } from "pg";
const dotenvConfig = require("../config/dotenvConfig");

const db = new Pool({
  user: dotenvConfig.DB_CONFIG.user,
  host: dotenvConfig.DB_CONFIG.host,
  database: dotenvConfig.DB_CONFIG.database,
  password: dotenvConfig.DB_CONFIG.password,
  port: Number(dotenvConfig.DB_CONFIG.port),
});

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Database connected successfully:", result.rows);
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    // await db.end();
  }
})();

export default db;
