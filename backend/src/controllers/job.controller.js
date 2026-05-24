import { ok } from "../utils/api-response.js";
import { getJob, listJobs } from "../services/job.service.js";

export async function getJobById(req, res) {
  const job = await getJob(req.params.id);
  return ok(res, job);
}

export async function getJobs(req, res) {
  const jobs = await listJobs();
  return ok(res, jobs);
}
