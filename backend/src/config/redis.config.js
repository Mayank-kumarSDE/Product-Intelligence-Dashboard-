import IORedis from "ioredis";
import { env } from "./env.config.js";

const isTls = env.redisUrl.startsWith("rediss://");

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: isTls ? {} : undefined
});
