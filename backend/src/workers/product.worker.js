import { Worker } from "bullmq";
import { PRODUCT_QUEUE_NAME } from "../config/queue.config.js";
import { redisConnection } from "../config/redis.config.js";
import { sequelize } from "../db/models/index.js";
import { updateJob } from "../repositories/job.repository.js";
import { createValidatedProduct } from "../services/product.service.js";
import { extractProductsFromVideoMock } from "../utils/mock-video-extractor.js";

async function processProductJob(queueJob) {
  const { appJobId, source, products, enhanceTitles } = queueJob.data;
  await updateJob(appJobId, { status: "processing", progress: 10 });

  try {
    const extractedProducts = source === "video" ? await extractProductsFromVideoMock() : products;
    await updateJob(appJobId, {
      totalProducts: extractedProducts.length,
      progress: 25
    });

    for (const [index, product] of extractedProducts.entries()) {
      await createValidatedProduct(appJobId, product, {
        enhanceTitle: Boolean(enhanceTitles)
      });
      const progress = 25 + Math.round(((index + 1) / extractedProducts.length) * 70);
      await updateJob(appJobId, { progress });
    }

    await updateJob(appJobId, { status: "completed", progress: 100 });
  } catch (error) {
    await updateJob(appJobId, {
      status: "failed",
      errorMessage: error.message,
      progress: 100
    });
    throw error;
  }
}

await sequelize.authenticate();

const worker = new Worker(PRODUCT_QUEUE_NAME, processProductJob, {
  connection: redisConnection,
  concurrency: 2
});

worker.on("completed", (job) => {
  console.log(`Queue job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Queue job ${job?.id} failed`, error);
});

console.log("Product worker started");
