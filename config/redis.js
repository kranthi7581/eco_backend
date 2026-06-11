const Redis = require("ioredis");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    // Reconnect delay increases with retries, capped at 2 seconds
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("Redis client connected successfully");
});

redis.on("error", (error) => {
  console.error("Redis client connection error:", error.message);
});

module.exports = redis;
