import { Router } from "express";
import { getJobById, getJobs } from "../controllers/job.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const jobRouter = Router();

jobRouter.get("/", asyncHandler(getJobs));
jobRouter.get("/:id", asyncHandler(getJobById));
