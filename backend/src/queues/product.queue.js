import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import { PRODUCT_QUEUE_NAME } from "../config/queue.config.js";

export const productQueue = new Queue(PRODUCT_QUEUE_NAME, {
  connection: redisConnection
});

export function addProductProcessingJob(payload) {
  return productQueue.add("process-products", payload, {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 1500
    }
  });
}
