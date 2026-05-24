import IORedis from "ioredis";
import { env } from "./env.config.js";

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null
});

redisConnection.on("connect", () => {
  console.log("Successfully connected to Render Redis");
});

redisConnection.on("error", (error) => {
  console.error("Redis Connection Error:", error.message);
});

redisConnection.on("end", () => {
  console.warn("Redis connection closed by Render");
});
