const Redis = require("ioredis");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  enableOfflineQueue: false, // Fail fast when Redis is down, letting try/catch fall back to DB instantly instead of hanging requests
  retryStrategy(times) {
    // Reconnect delay increases with retries, capped at 10 seconds to avoid high CPU usage/spam
    const delay = Math.min(times * 1000, 10000);
    return delay;
  },
});

let cacheRedisDownLogged = false;

redis.on("error", (err) => {
    if (err.code === "ECONNREFUSED") {
        if (!cacheRedisDownLogged) {
            console.warn("⚠️  [CACHE] Redis unavailable — falling back to DB");
            cacheRedisDownLogged = true;
        }
        return;
    }
    console.error("❌ [CACHE] Redis error:", err.message);
});

redis.on("ready", () => {
    if (cacheRedisDownLogged) {
        console.log("✅ [CACHE] Redis reconnected");
    } else {
        console.log("✅ [CACHE] Redis connected");
    }
    cacheRedisDownLogged = false;
});

// Export the redis client directly to prevent breaking imports in other files
redis.isConnected = () => redis.status === "ready";

module.exports = redis;
