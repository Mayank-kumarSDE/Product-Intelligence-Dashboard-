import { createJob } from "../repositories/job.repository.js";
import { addProductProcessingJob } from "../queues/product.queue.js";
import { parseProductCsv } from "../utils/csv-parser.js";

export async function enqueueVideoUpload(file, options = {}) {
  if (!file) {
    const error = new Error("Video file is required");
    error.statusCode = 400;
    throw error;
  }

  const job = await createJob("video");
  await addProductProcessingJob({
    appJobId: job.id,
    source: "video",
    enhanceTitles: Boolean(options.enhanceTitles)
  });

  return job;
}

export async function enqueueCsvUpload(file, options = {}) {
  if (!file) {
    const error = new Error("CSV file is required");
    error.statusCode = 400;
    throw error;
  }

  const products = parseProductCsv(file.buffer);
  if (!products.length) {
    const error = new Error("CSV does not contain products");
    error.statusCode = 400;
    throw error;
  }

  const job = await createJob("csv");
  await addProductProcessingJob({
    appJobId: job.id,
    source: "csv",
    products,
    enhanceTitles: Boolean(options.enhanceTitles)
  });

  return job;
}
