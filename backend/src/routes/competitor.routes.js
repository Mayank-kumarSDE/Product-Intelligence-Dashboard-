import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadCompetitorPricesCsv, triggerCompetitorRefresh } from "../controllers/competitor.controller.js";

export const competitorRouter = Router();

competitorRouter.post("/upload", upload.single("file"), asyncHandler(uploadCompetitorPricesCsv));
competitorRouter.post("/refresh", asyncHandler(triggerCompetitorRefresh));
