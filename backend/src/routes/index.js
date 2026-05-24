import { Router } from "express";
import { alertRouter } from "./alert.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { jobRouter } from "./job.routes.js";
import { productRouter } from "./product.routes.js";
import { uploadRouter } from "./upload.routes.js";

export const apiRouter = Router();

apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/alerts", alertRouter);
apiRouter.use("/dashboard", dashboardRouter);
