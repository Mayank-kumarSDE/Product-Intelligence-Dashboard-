import { ok } from "../utils/api-response.js";
import { getJob } from "../services/job.service.js";

export async function getJobById(req, res) {
  const job = await getJob(req.params.id);
  return ok(res, job);
}
