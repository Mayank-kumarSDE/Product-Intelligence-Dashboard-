import { Worker, Queue } from "bullmq";
import { PRODUCT_QUEUE_NAME } from "../config/queue.config.js";
import { redisConnection } from "../config/redis.config.js";
import { sequelize, Job } from "../db/models/index.js";
import { updateJob } from "../repositories/job.repository.js";
import { createValidatedProduct } from "../services/product.service.js";
import { extractProductsFromVideoMock } from "../utils/mock-video-extractor.js";

async function processProductJob(queueJob) {
  const { appJobId, source, products, enhanceTitles } = queueJob.data;
  
  // ✅ CHECK IF JOB EXISTS IN DATABASE
  const dbJob = await Job.findByPk(appJobId);
  if (!dbJob) {
    console.error(`❌ Job ${appJobId} not found in database. Removing from queue...`);
    return; // Skip this job
  }
  
  await updateJob(appJobId, { status: "processing", progress: 10 });

  try {
    const extractedProducts = source === "video" ? await extractProductsFromVideoMock() : products;
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
        console.error(`Row ${index + 1} failed during ingestion:`, err);
        failedRows.push({
          rowNum: index + 1,
          sku: product.sku || "N/A",
          reason: err.message || "Validation/Ingestion error"
        });
      }
      const progress = 25 + Math.round(((index + 1) / extractedProducts.length) * 70);
      await updateJob(appJobId, { progress, failedRows });
    }

    const finalStatus = processedCount === 0 && extractedProducts.length > 0 ? "failed" : "completed";
    const errorMessage = failedRows.length > 0 ? `${failedRows.length} rows failed to process.` : null;

    await updateJob(appJobId, {
      status: finalStatus,
      errorMessage,
      progress: 100
    });
  } catch (error) {
    await updateJob(appJobId, {
      status: "failed",
      errorMessage: error.message,
      progress: 100
    });
    throw error;
  }
}

// ✅ FIXED: Queue object se jobs get karo (YE FUNCTION FIX KARO)
async function cleanOrphanJobs() {
  try {
    const queue = new Queue(PRODUCT_QUEUE_NAME, { connection: redisConnection });
    const jobs = await queue.getJobs(['waiting', 'active', 'delayed', 'failed', 'completed']);
    
    console.log(`Checking ${jobs.length} jobs for orphan status...`);
    
    let removedCount = 0;
    for (const job of jobs) {
      const dbJob = await Job.findByPk(job.data.appJobId);
      if (!dbJob) {
        console.log(`Removing orphan job ${job.id} (Job ${job.data.appJobId} not in DB)`);
        await job.remove();
        removedCount++;
      }
    }
    
    console.log(`Removed ${removedCount} orphan jobs`);
    await queue.close();
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
}

await sequelize.authenticate();

// ✅ RUN CLEANUP BEFORE STARTING WORKER
await cleanOrphanJobs();

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