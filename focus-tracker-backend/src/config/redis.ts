import { createClient, RedisClientType } from "redis";

// Get Redis URL from environment variables
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Validate Redis URL format
if (!redisUrl.startsWith("redis://") && !redisUrl.startsWith("rediss://")) {
  console.warn("Invalid Redis URL format. Using default localhost connection.");
}

let client: RedisClientType | null = null;
let isConnecting = false;
let lastConnectionAttempt = 0;
const CONNECTION_COOLDOWN = 5000; // 5 seconds

// Mock Redis client for development when Redis is not available
class MockRedisClient {
  private data: Map<string, string> = new Map();
  private expirations: Map<string, number> = new Map();

  async get(key: string): Promise<string | null> {
    const value = this.data.get(key);
    const expiration = this.expirations.get(key);

    if (expiration && Date.now() > expiration) {
      this.data.delete(key);
      this.expirations.delete(key);
      return null;
    }

    return value || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    this.data.set(key, value);
    this.expirations.set(key, Date.now() + seconds * 1000);
  }

  async del(key: string): Promise<void> {
    this.data.delete(key);
    this.expirations.delete(key);
  }

  async incr(key: string): Promise<number> {
    const current = parseInt(this.data.get(key) || "0", 10);
    const newValue = current + 1;
    this.data.set(key, newValue.toString());
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<void> {
    this.expirations.set(key, Date.now() + seconds * 1000);
  }

  isOpen = true;
}

export const getRedisClient = async (): Promise<
  RedisClientType | MockRedisClient
> => {
  // If we're in development and Redis is not available, use mock client
  if (process.env.NODE_ENV !== "production" && !process.env.REDIS_URL) {
    console.log("Using mock Redis client for development");
    return new MockRedisClient();
  }

  if (client && client.isOpen) {
    return client;
  }

  // Prevent multiple simultaneous connection attempts and add cooldown
  if (
    isConnecting ||
    Date.now() - lastConnectionAttempt < CONNECTION_COOLDOWN
  ) {
    console.log(
      "Using mock Redis client due to connection cooldown or in progress"
    );
    return new MockRedisClient();
  }

  isConnecting = true;
  lastConnectionAttempt = Date.now();

  try {
    client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log("Max retries reached. Using mock Redis client.");
            return new Error("Max retries reached");
          }
          return Math.min(retries * 100, 3000);
        },
        connectTimeout: 5000,
      },
    }) as RedisClientType;

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await client.connect();
    console.log("Connected to Redis successfully");
    return client;
  } catch (err) {
    console.error("Error connecting to Redis:", err);
    client = null;
    // In development, return mock client instead of throwing
    if (process.env.NODE_ENV !== "production") {
      console.log("Falling back to mock Redis client");
      return new MockRedisClient();
    }
    throw err;
  } finally {
    isConnecting = false;
  }
};

// For non-serverless environments, try to connect but don't fail if it doesn't work
if (process.env.NODE_ENV !== "production") {
  getRedisClient().catch((err) => {
    console.error(
      "Initial Redis connection failed, will use mock client:",
      err
    );
  });
}

export default getRedisClient;
