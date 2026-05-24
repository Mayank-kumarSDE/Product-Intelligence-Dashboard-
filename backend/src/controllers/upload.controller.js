import { created } from "../utils/api-response.js";
import { enqueueCsvUpload, enqueueVideoUpload } from "../services/upload.service.js";

export async function uploadVideo(req, res) {
  const job = await enqueueVideoUpload(req.file, {
    enhanceTitles: req.body.enhanceTitles === "true"
  });
  return created(res, job, "Video processing job created");
}

export async function uploadCsv(req, res) {
  const job = await enqueueCsvUpload(req.file, {
    enhanceTitles: req.body.enhanceTitles === "true"
  });
  return created(res, job, "CSV processing job created");
}
