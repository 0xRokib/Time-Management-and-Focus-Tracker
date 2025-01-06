import { createClient } from "redis";
const dotenvConfig = require("./config/dotenvConfig");
const redisClient = createClient({
  url: dotenvConfig.REDIS_CONFIG.url,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
