import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadCsv, uploadVideo } from "../controllers/upload.controller.js";

export const uploadRouter = Router();

uploadRouter.post("/video", upload.single("file"), asyncHandler(uploadVideo));
uploadRouter.post("/csv", upload.single("file"), asyncHandler(uploadCsv));
