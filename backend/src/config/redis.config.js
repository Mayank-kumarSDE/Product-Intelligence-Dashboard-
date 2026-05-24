import IORedis from "ioredis";
import { env } from "./env.config.js";

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null
});
