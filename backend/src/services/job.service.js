import { findJobById } from "../repositories/job.repository.js";

export async function getJob(id) {
  const job = await findJobById(id);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }
  return job;
}
