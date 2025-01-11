import { Pool } from "pg";
const dotenvConfig = require("../config/dotenvConfig");

// Define the type of the configuration
interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  connectionString?: string; // Optional property
}

// Build db config
const dbConfig: DBConfig = {
  user: dotenvConfig.DB_CONFIG.user,
  host: dotenvConfig.DB_CONFIG.host,
  database: dotenvConfig.DB_CONFIG.database,
  password: dotenvConfig.DB_CONFIG.password,
  port: Number(dotenvConfig.DB_CONFIG.port),
};

// If a connection string is provided, override individual config values
if (dotenvConfig.DB_CONFIG.connectionString) {
  dbConfig.connectionString = dotenvConfig.DB_CONFIG.connectionString;
}

const db = new Pool(dbConfig);

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Database connected successfully:", result.rows);
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

export default db;
