import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", asyncHandler(getDashboardSummary));
