import { createClient } from "redis";

// Update the host to the Redis service name in Docker Compose
const client = createClient({
  url: "redis://redis_cache:6379", // Use the container service name here
});

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await client.connect();
})();

export default client;
