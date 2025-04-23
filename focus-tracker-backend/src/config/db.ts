import { Pool } from "pg";
const dotenvConfig = require("../config/dotenvConfig");

// Define the type of the configuration
interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  connectionString?: string;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Build db config
const dbConfig: DBConfig = {
  user: dotenvConfig.DB_CONFIG.user,
  host: dotenvConfig.DB_CONFIG.host,
  database: dotenvConfig.DB_CONFIG.database,
  password: dotenvConfig.DB_CONFIG.password,
  port: Number(dotenvConfig.DB_CONFIG.port),
  max: 1, // Limit to 1 connection in serverless environment
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Increase timeout to 5 seconds
};

// If a connection string is provided, override individual config values
if (dotenvConfig.DB_CONFIG.connectionString) {
  dbConfig.connectionString = dotenvConfig.DB_CONFIG.connectionString;
  dbConfig.ssl = { rejectUnauthorized: false };
}

const db = new Pool(dbConfig);

// Test connection with retry logic
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await db.query("SELECT NOW()");
      console.log("Database connected successfully:", result.rows);
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) {
        console.error("All database connection attempts failed");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }
  }
};

// Only test connection if not in production
if (process.env.NODE_ENV !== "production") {
  testConnection();
}

export default db;
