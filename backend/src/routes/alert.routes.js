import { Router } from "express";
import { getAlerts, readAlert } from "../controllers/alert.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const alertRouter = Router();

alertRouter.get("/", asyncHandler(getAlerts));
alertRouter.patch("/:id/read", asyncHandler(readAlert));
