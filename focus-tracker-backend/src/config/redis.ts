import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://redis_cache:6379";

const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

export default client;
