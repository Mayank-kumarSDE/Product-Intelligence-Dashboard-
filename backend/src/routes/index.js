import { Router } from "express";
import { alertRouter } from "./alert.routes.js";
import { authRouter } from "./auth.routes.js";
import { competitorRouter } from "./competitor.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { jobRouter } from "./job.routes.js";
import { productRouter } from "./product.routes.js";
import { uploadRouter } from "./upload.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use(authMiddleware);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/competitor-prices", competitorRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/alerts", alertRouter);
apiRouter.use("/dashboard", dashboardRouter);
