import { Router } from "express";
import { getJobById } from "../controllers/job.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const jobRouter = Router();

jobRouter.get("/:id", asyncHandler(getJobById));
