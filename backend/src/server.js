import { env } from "./config/env.config.js";
import { sequelize } from "./db/models/index.js";
import { app } from "./app.js";
import { Worker } from "bullmq";
import { PRODUCT_QUEUE_NAME } from "./config/queue.config.js";
import { redisConnection } from "./config/redis.config.js";
import { updateJob } from "./repositories/job.repository.js";
import { createValidatedProduct } from "./services/product.service.js";
import { extractProductsFromVideoMock } from "./utils/mock-video-extractor.js";

await sequelize.authenticate();
await sequelize.sync();

app.listen(env.port, () => {
  console.log(`Quantacus API running on port ${env.port}`);
});

// ── Inline BullMQ worker (runs in the same process) ──────────────────────────
async function processProductJob(queueJob) {
  const { appJobId, source, products, enhanceTitles } = queueJob.data;
  await updateJob(appJobId, { status: "processing", progress: 10 });

  try {
    const extractedProducts =
      source === "video" ? await extractProductsFromVideoMock() : products;

    await updateJob(appJobId, {
      totalProducts: extractedProducts.length,
      progress: 25
    });

    const failedRows = [];
    let processedCount = 0;

    for (const [index, product] of extractedProducts.entries()) {
      try {
        await createValidatedProduct(appJobId, product, {
          enhanceTitle: Boolean(enhanceTitles)
        });
        processedCount++;
      } catch (err) {
        console.error(`Row ${index + 1} failed:`, err.message);
        failedRows.push({
          rowNum: index + 1,
          sku: product.sku || "N/A",
          reason: err.message || "Ingestion error"
        });
      }

      const progress = 25 + Math.round(((index + 1) / extractedProducts.length) * 70);
      await updateJob(appJobId, { progress, failedRows });
    }

    const finalStatus =
      processedCount === 0 && extractedProducts.length > 0 ? "failed" : "completed";

    await updateJob(appJobId, {
      status: finalStatus,
      errorMessage: failedRows.length > 0 ? `${failedRows.length} rows failed.` : null,
      progress: 100
    });
  } catch (error) {
    await updateJob(appJobId, {
      status: "failed",
      errorMessage: error.message,
      progress: 100
    });
  }
}

const worker = new Worker(PRODUCT_QUEUE_NAME, processProductJob, {
  connection: redisConnection,
  concurrency: 2
});

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err.message));

console.log("BullMQ worker started inline");
